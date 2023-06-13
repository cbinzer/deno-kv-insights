import { findAllEntries } from './kvEntryRepository.ts';
import { DBKvEntry, KvValueType, Pagination, StrippedKvEntry } from './models.ts';

export async function getAllEntries(pagination?: Pagination): Promise<StrippedKvEntry[]> {
  const entries = await findAllEntries(pagination);
  return entries.map(mapToKvStrippedEntry);
}

function mapToKvStrippedEntry(kvEntry: DBKvEntry): StrippedKvEntry {
  return {
    id: kvEntry.id,
    key: kvEntry.key,
    valueType: getValueType(kvEntry.value),
  };
}

function getValueType(value: unknown): KvValueType {
  if (value === null) {
    return KvValueType.NULL;
  }

  switch (typeof value) {
    case 'object':
      return KvValueType.OBJECT;
    case 'boolean':
      return KvValueType.BOOLEAN;
    case 'number':
      return KvValueType.NUMBER;
    case 'undefined':
      return KvValueType.UNDEFINED;
    default:
      return KvValueType.STRING;
  }
}
