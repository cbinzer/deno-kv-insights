import { db } from '../common/db.ts';
import { DBKvEntry, KvKeyPart, Pagination } from './models.ts';
import { decode, encode } from 'https://deno.land/std@0.191.0/encoding/base64.ts';

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

export async function entryExists(key: KvKeyPart[]): Promise<boolean> {
  const { versionstamp } = await db.get(key);
  return !!versionstamp;
}
