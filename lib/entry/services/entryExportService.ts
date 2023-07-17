import { EntriesExportForCreation, EntriesExportHeader } from '../models.ts';
import { chunk } from '../../../deps.ts';
import { findEntriesByKeys } from '../entryRepository.ts';
import { replace } from '../utils.ts';

export async function createEntriesExport(exportForCreation: EntriesExportForCreation): Promise<ReadableStream> {
  const suffix = '\n';
  const exportHeader: EntriesExportHeader = {
    title: 'KV Insights entries export in JSON Lines format: https://jsonlines.org/',
    created: exportForCreation.created,
    version: '1.0.0',
  };
  const keysChunks = chunk(exportForCreation.keys, 10);
  const keysChunksIterator = keysChunks.entries();

  return new ReadableStream({
    start: async (controller: ReadableStreamDefaultController) => {
      controller.enqueue(JSON.stringify(exportHeader) + suffix);
    },

    pull: async (controller: ReadableStreamDefaultController) => {
      const { done, value } = keysChunksIterator.next();
      if (done) {
        controller.close();
        return;
      }

      const keys = value[1];
      const entries = await findEntriesByKeys(keys);
      controller.enqueue(JSON.stringify(entries, replace) + suffix);
    },
  }).pipeThrough(new TextEncoderStream());
}
