import { EntryAlreadyExistsError, EntryNotFoundError, ValidationError } from '../common/errors.ts';
import { deleteEntry, entryExists, findAllEntries, findEntryByCursor, saveEntry } from './entryRepository.ts';
import {
  DBEntry,
  Entry,
  EntryForCreation,
  EntryValue,
  KeyPart,
  Pagination,
  StrippedEntry,
  ValueType,
} from './models.ts';

export async function getAllEntries(pagination?: Pagination): Promise<StrippedEntry[]> {
  const entries = await findAllEntries(pagination);
  return entries.map(mapToStrippedEntry);
}

export async function getEntryByCursor(cursor: string): Promise<Entry> {
  const entry = await findEntryByCursor(cursor);
  if (!entry) {
    throw new EntryNotFoundError(`Entry with cursor ${cursor} not found.`);
  }

  return mapToEntry(entry);
}

export async function createEntry(entry: EntryForCreation): Promise<Entry> {
  await assertEntryForCreation(entry);

  const convertedValue = convertValue(entry.valueType, entry.value);
  const newEntry = await saveEntry(entry.key, convertedValue);

  return mapToEntry(newEntry);
}

export async function updateEntryValue(cursor: string, value: EntryValue): Promise<Entry> {
  const entry = await getEntryByCursor(cursor);
  const updatedEntry = await saveEntry(entry.key, value);
  return mapToEntry(updatedEntry);
}

export async function deleteEntryByCursor(cursor: string): Promise<void> {
  const entry = await getEntryByCursor(cursor);
  await deleteEntry(entry.key);
}

async function assertEntryForCreation(entry: EntryForCreation): Promise<void> {
  await assertKey(entry.key);
  assertValue(entry.valueType, entry.value);
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

function assertValue(valueType: ValueType, value: EntryValue): void {
  const realValueType = getValueType(value);
  if (valueType === ValueType.DATE && realValueType === ValueType.STRING) {
    return;
  }

  if (valueType !== realValueType) {
    throw new ValidationError(
      `The given value type '${valueType}' is not matching the detected type '${realValueType}' of the value.`,
    );
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

function mapToStrippedEntry(entry: DBEntry): StrippedEntry {
  return {
    cursor: entry.cursor,
    key: entry.key,
    valueType: getValueType(entry.value),
  };
}

function mapToEntry(entry: DBEntry): Entry {
  return {
    cursor: entry.cursor,
    key: entry.key,
    valueType: getValueType(entry.value),
    value: entry.value,
    version: entry.versionstamp,
  };
}

function getValueType(value: unknown): ValueType {
  if (value === null) {
    return ValueType.NULL;
  }

  if (value instanceof Date) {
    return ValueType.DATE;
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
    case 'string':
      return ValueType.STRING;
    default:
      throw new ValidationError(`Can't find the matching value type for ${typeof value}.`);
  }
}
