import { EntryAlreadyExistsError, EntryNotFoundError, ValidationError } from '../common/errors.ts';
import { deleteEntry, entryExists, findAllEntries, findEntryByCursor, saveEntry } from './kvEntryRepository.ts';
import { DBEntry, Entry, KeyPart, ValueType, Pagination, StrippedEntry } from './models.ts';

export async function getAllEntries(pagination?: Pagination): Promise<StrippedEntry[]> {
  const entries = await findAllEntries(pagination);
  return entries.map(mapToKvStrippedEntry);
}

export async function getEntryByCursor(cursor: string): Promise<Entry> {
  const entry = await findEntryByCursor(cursor);
  if (!entry) {
    throw new EntryNotFoundError(`Entry with cursor ${cursor} not found.`);
  }

  return mapToKvEntry(entry);
}

export async function createEntry(key: KeyPart[], value: unknown): Promise<Entry> {
  if (!Array.isArray(key) || key.length === 0) {
    throw new ValidationError('Invalid key.');
  }

  if (await entryExists(key)) {
    throw new EntryAlreadyExistsError(
      `Can't create entry with key [${key.join(', ')}] because an entry already exists.`,
    );
  }

  const newEntry = await saveEntry(key, value);

  return mapToKvEntry(newEntry);
}

export async function updateEntryValue(cursor: string, value: unknown): Promise<Entry> {
  const entry = await getEntryByCursor(cursor);
  const updatedEntry = await saveEntry(entry.key, value);
  return mapToKvEntry(updatedEntry);
}

export async function deleteEntryByCursor(cursor: string): Promise<void> {
  const entry = await getEntryByCursor(cursor);
  await deleteEntry(entry.key);
}

function mapToKvStrippedEntry(kvEntry: DBEntry): StrippedEntry {
  return {
    id: kvEntry.id,
    key: kvEntry.key,
    valueType: getValueType(kvEntry.value),
  };
}

function mapToKvEntry(kvEntry: DBEntry): Entry {
  return {
    id: kvEntry.id,
    key: kvEntry.key,
    valueType: getValueType(kvEntry.value),
    value: kvEntry.value,
    version: kvEntry.versionstamp,
  };
}

function getValueType(value: unknown): ValueType {
  if (value === null) {
    return ValueType.NULL;
  }

  switch (typeof value) {
    case 'object':
      return ValueType.OBJECT;
    case 'boolean':
      return ValueType.BOOLEAN;
    case 'number':
      return ValueType.NUMBER;
    case 'undefined':
      return ValueType.UNDEFINED;
    default:
      return ValueType.STRING;
  }
}
