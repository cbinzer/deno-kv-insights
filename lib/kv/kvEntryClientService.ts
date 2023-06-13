import { HTTPStrippedKvEntries, Pagination } from './models.ts';

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
