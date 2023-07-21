import { EntriesImportResult } from '../models.ts';

export async function importEntries(entriesImportFile: File): Promise<EntriesImportResult> {
  return fetch('/kv-insights/api/entries/imports', {
    method: 'POST',
    body: entriesImportFile,
  }).then((response) => response.json());
}
