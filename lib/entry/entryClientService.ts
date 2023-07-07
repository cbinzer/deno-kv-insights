import { EntryAlreadyExistsError } from '../common/errors.ts';
import {
  ClientEntryFilter,
  Entry,
  EntryForCreation,
  EntryForUpdate,
  HTTPStrippedEntries,
  NewEntry,
  ValueType,
} from './models.ts';
import { HTTPError, Pagination } from '../common/models.ts';
import { replace, revive } from './utils.ts';

const ENDPOINT_URL = `${window.location?.origin}/kv-insights/api/entries`;

export function getAllEntries(pagination?: Pagination, filter?: ClientEntryFilter): Promise<HTTPStrippedEntries> {
  const url = new URL(ENDPOINT_URL);
  if (pagination?.first && pagination.first > 0) {
    url.searchParams.set('first', pagination.first.toString());
  }

  if (pagination?.after) {
    url.searchParams.set('after', pagination.after);
  }

  if (filter?.keyPrefix) {
    url.searchParams.set('prefix', filter.keyPrefix);
  }

  return fetch(url).then((response) => response.text()).then((text) => JSON.parse(text, revive));
}

export async function getEntryByCursor(cursor: string): Promise<Entry> {
  const url = new URL(`${ENDPOINT_URL}/${cursor}`);
  const response = await fetch(url);
  const entry = (await response.text().then((text) => JSON.parse(text, revive))) as Entry;

  return convertValue(entry);
}

export async function createEntry(entry: EntryForCreation): Promise<NewEntry> {
  const url = new URL(ENDPOINT_URL);
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(entry, replace),
  });

  const result = await response.text().then((text) => JSON.parse(text, revive));
  if (result.status === 409) {
    throw new EntryAlreadyExistsError(result.message);
  }

  return convertValue(result);
}

export async function updateEntry(entry: EntryForUpdate): Promise<Entry> {
  const { cursor, ...entryWithoutCursor } = entry;
  const url = new URL(`${ENDPOINT_URL}/${cursor}`);

  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(entryWithoutCursor, replace),
  });

  return convertValue(await response.text().then((text) => JSON.parse(text, revive)));
}

export async function deleteEntryByCursor(cursor: string): Promise<undefined | HTTPError> {
  const url = new URL(`${ENDPOINT_URL}/${cursor}`);
  const response = await fetch(url, {
    method: 'DELETE',
  });

  if (!response.ok) {
    return response.text().then((text) => JSON.parse(text, revive));
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
