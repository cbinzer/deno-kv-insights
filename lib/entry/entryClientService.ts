import { EntryAlreadyExistsError } from '../common/errors.ts';
import {
  Entry,
  EntryForCreation,
  EntryValue,
  HTTPError,
  HTTPStrippedEntries,
  Pagination,
  ValueType,
} from './models.ts';

const ENDPOINT_URL = `${window.location?.origin}/api/entries`;

export function getAllEntries(pagination?: Pagination): Promise<HTTPStrippedEntries> {
  const url = new URL(ENDPOINT_URL);
  if (pagination?.first && pagination.first > 0) {
    url.searchParams.set('first', pagination.first.toString());
  }

  if (pagination?.after) {
    url.searchParams.set('after', pagination.after);
  }

  return fetch(url).then((response) => response.json());
}

export async function getEntryByCursor(cursor: string): Promise<Entry> {
  const url = new URL(`${ENDPOINT_URL}/${cursor}`);
  const response = await fetch(url);
  const entry = (await response.json()) as Entry;

  return convertValue(entry);
}

export async function createEntry(entry: EntryForCreation): Promise<Entry> {
  const url = new URL(ENDPOINT_URL);
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(entry),
  });

  const result = await response.json();
  if (result.status === 409) {
    throw new EntryAlreadyExistsError(result.message);
  }

  return result;
}

export async function updateEntryValue(cursor: string, value: EntryValue): Promise<Entry> {
  const url = new URL(`${ENDPOINT_URL}/${cursor}`);
  const response = await fetch(url, {
    method: 'PATCH',
    body: JSON.stringify({ value }),
  });

  return response.json();
}

export async function deleteEntryByCursor(cursor: string): Promise<undefined | HTTPError> {
  const url = new URL(`${ENDPOINT_URL}/${cursor}`);
  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    return response.json();
  }

  return undefined;
}

function convertValue(entry: Entry): Entry {
  if (entry.valueType === ValueType.DATE) {
    return {
      ...entry,
      value: new Date(entry.value as string),
    };
  }

  return entry;
}
