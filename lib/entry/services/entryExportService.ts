import { chunk } from '../../../deps.ts';
import { EntriesExportForCreation, EntriesExportHeader } from '../models.ts';
import { replace } from '../utils.ts';
import { getEntriesByKeys } from './entryService.ts';

export function createEntriesExport(exportForCreation: EntriesExportForCreation): ReadableStream {
  const suffix = '\n';
  const exportHeader: EntriesExportHeader = {
    title: 'KV Insights entries export in JSON Lines format: https://jsonlines.org/',
    created: exportForCreation.created,
    version: '1.0.0',
  };
  const keysChunks = chunk(exportForCreation.keys, 10);
  const keysChunksIterator = keysChunks.entries();

  return new ReadableStream({
    start: (controller: ReadableStreamDefaultController) => {
      controller.enqueue(JSON.stringify(exportHeader) + suffix);
    },

    pull: async (controller: ReadableStreamDefaultController) => {
      const { done, value } = keysChunksIterator.next();
      if (done) {
        controller.close();
        return;
      }

      const keys = value[1];
      const entries = await getEntriesByKeys(keys);
      controller.enqueue(JSON.stringify(entries, replace) + suffix);
    },
  }).pipeThrough(new TextEncoderStream());
}
