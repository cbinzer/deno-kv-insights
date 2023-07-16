import { EntriesExportForCreation } from '../models.ts';
import { chunk } from '../../../deps.ts';
import { findEntriesByKeys } from '../entryRepository.ts';
import { replace } from '../utils.ts';

export async function createEntriesExport(exportForCreation: EntriesExportForCreation): Promise<ReadableStream> {
  const initialJSON = `{ "created": "${exportForCreation.created.toISOString()}", "version": "1.0.0", "entries": [`;
  const endJSON = '] }';
  const encoder = new TextEncoder();
  const keysChunks = chunk(exportForCreation.keys, 10);
  const keysChunksIterator = keysChunks.entries();

  const pull = async (controller: ReadableStreamDefaultController, first = false) => {
    const { done, value } = keysChunksIterator.next();
    if (done) {
      controller.enqueue(encoder.encode(endJSON));
      controller.close();
      return;
    }

    const keys = value[1];
    const entries = await findEntriesByKeys(keys);
    const entriesAsString = JSON.stringify(entries, replace).replace('[', first ? '' : ',').replace(/]$/, '');

    controller.enqueue(encoder.encode(entriesAsString));
  };

  return new ReadableStream({
    start: async (controller: ReadableStreamDefaultController) => {
      controller.enqueue(encoder.encode(initialJSON));
      return pull(controller, true);
    },
    pull,
  });
}
