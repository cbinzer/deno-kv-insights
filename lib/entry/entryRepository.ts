import { encode } from '$std/encoding/base64.ts';
import { db } from '../common/db.ts';
import { DBEntry, EntryValue, KeyPart, Pagination } from './models.ts';
import {VersionConflictError} from '../common/errors.ts';

export async function findAllEntries(pagination?: Pagination): Promise<DBEntry[]> {
  const entries: DBEntry[] = [];

  const entriesIterator = await db.list({ prefix: [] }, { limit: pagination?.first, cursor: pagination?.after });
  for await (const entry of entriesIterator) {
    entries.push({
      ...entry,
      cursor: entriesIterator.cursor,
    });
  }

  return entries;
}

export async function findEntryByCursor(cursor: string): Promise<DBEntry | null> {
  try {
    let entriesIterator = await db.list({ prefix: [] }, { limit: 1, cursor });
    await entriesIterator.next();

    entriesIterator = await db.list({ prefix: [] }, { limit: 1, cursor: entriesIterator.cursor, reverse: true });
    for await (const entry of entriesIterator) {
      return {
        ...entry,
        cursor: cursor,
      };
    }
  } catch (e) {
    if (e.message !== 'invalid cursor') {
      throw e;
    }
  }

  return null;
}

export async function saveEntry(
  key: KeyPart[],
  value: EntryValue,
  versionstamp: string | null = null,
): Promise<DBEntry> {
  const commitResult: { ok: boolean; versionstamp: string } = await db.atomic()
    .check({ key, versionstamp })
    .set(
      key,
      value,
    ).commit();
  if (!commitResult.ok) {
    throw new VersionConflictError(`Version conflict while setting entry with key '${key}' and version stamp '${versionstamp}'. DB version stamp ${commitResult.versionstamp}.`);
  }

  // TODO change
  const cursor = encode(Uint8Array.of(2, ...new TextEncoder().encode(key.join('')), 0));
  return {
    cursor,
    versionstamp: commitResult.versionstamp,
    key,
    value,
  };
}

export async function entryExists(key: KeyPart[]): Promise<boolean> {
  const { versionstamp } = await db.get(key);
  return !!versionstamp;
}

export async function deleteEntry(key: KeyPart[]): Promise<void> {
  await db.delete(key);
}
