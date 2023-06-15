import { encode } from 'https://deno.land/std@0.191.0/encoding/base64.ts';
import { db } from '../common/db.ts';
import { DBEntry, KeyPart, Pagination } from './models.ts';

export async function findAllEntries(pagination?: Pagination): Promise<DBEntry[]> {
  const entries: DBEntry[] = [];

  const entriesIterator = await db.list({ prefix: [] }, { limit: pagination?.first, cursor: pagination?.after });
  for await (const entry of entriesIterator) {
    entries.push({
      ...entry,
      id: entriesIterator.cursor,
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
        id: cursor,
      };
    }
  } catch (e) {
    if (e.message !== 'invalid cursor') {
      throw e;
    }
  }

  return null;
}

export async function saveEntry(key: KeyPart[], value: unknown): Promise<DBEntry> {
  const commitResult: { ok: boolean; versionstamp: string } = await db.set(key, value);
  if (!commitResult.ok) {
    throw new Error('An unknown error occurred on saving entry.');
  }

  // TODO change
  const id = encode(Uint8Array.of(2, ...new TextEncoder().encode(key.join('')), 0));
  return {
    id,
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
