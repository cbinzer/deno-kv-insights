import { EntryAlreadyExistsError, EntryNotFoundError, ValidationError } from '../../common/errors.ts';
import {
  deleteAllEntriesByKeys,
  deleteEntry,
  entryExists,
  findAllEntries,
  findEntryByCursor,
  saveEntry,
} from '../entryRepository.ts';
import {
  CursorBasedDBEntry,
  DBEntry,
  Entry,
  EntryFilter,
  EntryForCreation,
  EntryForUpdate,
  EntryKey,
  EntryValue,
  KeyPart,
  NewEntry,
  StrippedEntry,
  ValueType,
} from '../models.ts';
import { Pagination } from '../../common/models.ts';
import { getValueType } from '../utils.ts';

export async function getAllEntries(filter?: EntryFilter, pagination?: Pagination): Promise<StrippedEntry[]> {
  const entries = await findAllEntries(filter, pagination);
  return entries.map(mapToStrippedEntry);
}

export async function getEntryByCursor(cursor: string): Promise<Entry> {
  const entry = await findEntryByCursor(cursor);
  if (!entry) {
    throw new EntryNotFoundError(`Entry with cursor ${cursor} not found.`);
  }

  return mapToEntry(entry);
}

export async function createEntry(entry: EntryForCreation): Promise<NewEntry> {
  await assertEntryForCreation(entry);

  const newEntry = await saveEntry(entry.key, entry.value);
  return mapToNewEntry(newEntry);
}

export async function updateEntry(entry: EntryForUpdate): Promise<Entry> {
  await assertEntryForUpdate(entry);

  const existingEntry = await getEntryByCursor(entry.cursor);
  const convertedValue = convertValue(entry.valueType, entry.value);
  const updatedEntry = await saveEntry(existingEntry.key, convertedValue, entry.version);

  return mapToEntry({ ...updatedEntry, cursor: entry.cursor, prefixedCursor: '' });
}

export async function deleteEntryByCursor(cursor: string): Promise<void> {
  const entry = await getEntryByCursor(cursor);
  await deleteEntry(entry.key);
}

export async function deleteEntriesByKeys(keys: EntryKey[]): Promise<void> {
  await deleteAllEntriesByKeys(keys);
}

async function assertEntryForCreation(entry: EntryForCreation): Promise<void> {
  await assertKey(entry.key);
}

async function assertKey(key: KeyPart[]): Promise<void> {
  if (!Array.isArray(key) || key.length === 0) {
    throw new ValidationError('Invalid key.');
  }

  if (await entryExists(key)) {
    throw new EntryAlreadyExistsError(
      `Can't create entry with key [${key.join(', ')}] because an entry already exists.`,
    );
  }
}

function assertEntryForUpdate(entry: EntryForUpdate): void {
  if (!entry.cursor) {
    throw new ValidationError('Cursor is missing.');
  }

  if (!entry.version) {
    throw new ValidationError('Version is missing.');
  }
}

function convertValue(valueType: ValueType, value: EntryValue): EntryValue {
  switch (valueType) {
    case ValueType.DATE:
      if (value instanceof Date) {
        return value;
      }

      const newDate = new Date(value as string);
      if (isNaN(newDate.getTime())) {
        throw new ValidationError(`The given date value '${value}' couldn't be converted to a real date.`);
      }

      return newDate;
    default:
      return value;
  }
}

function mapToStrippedEntry(entry: CursorBasedDBEntry): StrippedEntry {
  return {
    cursor: entry.cursor,
    prefixedCursor: entry.prefixedCursor,
    key: entry.key,
    valueType: getValueType(entry.value),
  };
}

function mapToEntry(entry: CursorBasedDBEntry): Entry {
  return {
    cursor: entry.cursor,
    key: entry.key,
    value: entry.value,
    version: entry.versionstamp,
  };
}

function mapToNewEntry(entry: DBEntry): NewEntry {
  return {
    key: entry.key,
    value: entry.value,
    version: entry.versionstamp,
  };
}
