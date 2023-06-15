import { HTTPError, HTTPStrippedKvEntries, KvEntry, KvKeyPart, Pagination } from './models.ts';

const ENDPOINT_URL = `${window.location?.origin}/api/entries`;

export function getAllEntries(pagination?: Pagination): Promise<HTTPStrippedKvEntries> {
  const url = new URL(ENDPOINT_URL);
  if (pagination?.first && pagination.first > 0) {
    url.searchParams.set('first', pagination.first.toString());
  }

  if (pagination?.after) {
    url.searchParams.set('after', pagination.after);
  }

  return fetch(url).then((response) => response.json());
}

export function getEntryByCursor(cursor: string): Promise<KvEntry> {
  const url = new URL(`${ENDPOINT_URL}/${cursor}`);
  return fetch(url).then((response) => response.json());
}

export function createEntry(key: KvKeyPart[], value: unknown): Promise<KvEntry> {
  const url = new URL(ENDPOINT_URL);
  const entry = { key, value };

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(entry),
  }).then((response) => response.json());
}

export function deleteEntryByCursor(cursor: string): Promise<undefined | HTTPError> {
  const url = new URL(`${ENDPOINT_URL}/${cursor}`);
  return fetch(url, {
    method: 'DELETE',
  }).then((response) => {
    if (!response.ok) {
      return response.json();
    }

    return undefined;
  });
}
