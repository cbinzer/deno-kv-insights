import { db } from '../common/db.ts';
import { DBKvEntry, Pagination } from './models.ts';

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
