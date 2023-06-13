import { db } from '../common/db.ts';
import { DBKvEntry, KvKeyPart, Pagination } from './models.ts';

export async function findAllEntries(pagination?: Pagination): Promise<DBKvEntry[]> {
  const entries: DBKvEntry[] = [];

  const entriesIterator = await db.list({ prefix: [] }, { limit: pagination?.first, cursor: pagination?.after });
  for await (const entry of entriesIterator) {
    entries.push({
      ...entry,
      id: entriesIterator.cursor,
    });
  }

  return entries;
}

export async function saveEntry(key: KvKeyPart[], value: unknown): Promise<DBKvEntry> {
  const commitResult: { ok: boolean } = await db.set(key, value);
  if (!commitResult.ok) {
    throw new Error('An unknown error occurred on saving entry.');
  }

  const [newEntry] = await db.list({ prefix: key }, { limit: 1 });

  return newEntry;
}

export async function entryExists(key: KvKeyPart[]): Promise<boolean> {
  const { versionstamp } = await db.get(key);
  return !!versionstamp;
}
