import { chunk } from '../../deps.ts';
import { db } from '../common/db.ts';
import { UnknownError, VersionConflictError } from '../common/errors.ts';
import { Pagination } from '../common/models.ts';
import { CursorBasedDBEntry, DBEntry, EntryFilter, EntryKey, EntryValue, KeyPart } from './models.ts';
import { encodeCursor } from './services/cursorService.ts';

export async function findAllEntries(filter?: EntryFilter, pagination?: Pagination): Promise<CursorBasedDBEntry[]> {
  const entries: CursorBasedDBEntry[] = [];
  let prefix: KeyPart[] = [];
  let start: KeyPart[] | undefined = undefined;
  if (filter?.keyPrefix) {
    prefix = filter.keyPrefix;
    start = filter.keyPrefix;
  }

  const entriesIterator = await db.list({ prefix, start }, { limit: pagination?.first, cursor: pagination?.after });
  for await (const entry of entriesIterator) {
    entries.push({
      ...entry,
      key: entry.key as EntryKey,
      value: entry.value as EntryValue,
      cursor: encodeCursor(entry.key as EntryKey),
      prefixedCursor: entriesIterator.cursor,
    });
  }

  return entries;
}

export async function findEntryByCursor(cursor: string): Promise<CursorBasedDBEntry | null> {
  try {
    let entriesIterator = await db.list({ prefix: [] }, { limit: 1, cursor });
    await entriesIterator.next();

    entriesIterator = await db.list({ prefix: [] }, { limit: 1, cursor: entriesIterator.cursor, reverse: true });
    for await (const entry of entriesIterator) {
      return {
        ...entry,
        key: entry.key as EntryKey,
        value: entry.value as EntryValue,
        cursor: cursor,
        prefixedCursor: entriesIterator.cursor,
      };
    }
  } catch (e) {
    if (e.message !== 'invalid cursor') {
      throw e;
    }
  }

  return null;
}

export async function findEntriesByKeys(keys: EntryKey[]): Promise<CursorBasedDBEntry[]> {
  if (keys.length === 0) {
    return [];
  }

  const entries = await db.getMany(keys) as DBEntry[];
  return entries.filter((entry) => !!entry.versionstamp).map((entry) => {
    const cursor = encodeCursor(entry.key);
    return {
      ...entry,
      cursor,
      prefixedCursor: cursor,
    } as CursorBasedDBEntry;
  });
}

export async function saveEntry(
  key: KeyPart[],
  value: EntryValue,
  versionstamp: string | null = null,
): Promise<DBEntry> {
  const commitResult = await db.atomic()
    .check({ key, versionstamp })
    .set(
      key,
      value,
    ).commit();
  if (!commitResult.ok) {
    throw new VersionConflictError(
      `Version conflict while setting entry with key '${key}' and version stamp '${versionstamp}'.`,
    );
  }

  return {
    versionstamp: commitResult.versionstamp,
    key,
    value,
  };
}

export async function saveEntries(entries: DBEntry[]): Promise<void> {
  const atomicOperation = db.atomic();
  entries.forEach((entry) => atomicOperation.set(entry.key, entry.value));

  const commitResult: { ok: boolean } = await atomicOperation.commit();
  if (!commitResult.ok) {
    console.error('An unknown error occurred on saving entries.');
    throw new UnknownError();
  }
}

export async function entryExists(key: KeyPart[]): Promise<boolean> {
  const { versionstamp } = await db.get(key);
  return !!versionstamp;
}

export async function deleteEntry(key: KeyPart[]): Promise<void> {
  await db.delete(key);
}

export async function deleteAllEntriesByKeys(keys: EntryKey[]): Promise<void> {
  if (keys.length > 0) {
    for (const keysChunk of chunk(keys, 10) as EntryKey[][]) {
      const atomicOperation = db.atomic();
      keysChunk.forEach((key) => atomicOperation.delete(key));

      const commitResult = await atomicOperation.commit();
      if (!commitResult.ok) {
        console.error('An error occurred on deleting entries by keys.');
        throw new UnknownError();
      }
    }
  }
}
