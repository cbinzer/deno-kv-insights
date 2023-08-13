import { replace } from '../../common/httpUtils.ts';
import { EntryKey } from '../models.ts';

const ENDPOINT_URL = `/kv-insights/api/entries/export`;

export function createEntriesExportLink(keys: EntryKey[]): string {
  const base64Keys = btoa(JSON.stringify(keys, replace));
  return `${ENDPOINT_URL}?keys=${base64Keys}`;
}
