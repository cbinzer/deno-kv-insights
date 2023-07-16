import { EntriesExport, EntriesExportForCreation } from './models.ts';
import { getAllEntriesByKeys } from './entryService.ts';

export async function createEntriesExport(exportForCreation: EntriesExportForCreation): Promise<EntriesExport> {
  const entriesExport: EntriesExport = {
    created: new Date(),
    version: '1.0.0',
    entries: await getAllEntriesByKeys(exportForCreation.keys),
  };

  return entriesExport;
}
