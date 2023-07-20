import { DBEntry, EntriesExportHeader, EntriesImportResult, EntriesImportStatus, Entry } from '../models.ts';
import { TextLineStream } from 'https://deno.land/std@0.147.0/streams/delimiter.ts';
import { revive } from '../utils.ts';
import { ValidationError } from '../../common/errors.ts';
import { saveEntries } from '../entryRepository.ts';

export async function importEntries(importStream: ReadableStream<Uint8Array>): Promise<EntriesImportResult> {
  const amountImportedEntries = 0;
  let firstLineParsed = false;

  const jsonLines = importStream.pipeThrough(new TextDecoderStream()).pipeThrough(new TextLineStream());
  for await (const jsonLine of jsonLines) {
    if (jsonLine) {
      if (firstLineParsed) {
        const entries = JSON.parse(jsonLine, revive) as Entry[];
        const dbEntries: DBEntry[] = entries.map((entry) => {
          return { key: entry.key, versionstamp: entry.version, value: entry.value };
        });
        await saveEntries(dbEntries);
      } else {
        const exportHeader = JSON.parse(jsonLine) as EntriesExportHeader;
        assertExportHeader(exportHeader);
        firstLineParsed = true;
      }
    }
  }

  return {
    status: EntriesImportStatus.SUCCEEDED,
    amountImportedEntries,
  };
}

function assertExportHeader(exportHeader: EntriesExportHeader) {
  if (exportHeader.version !== '1.0.0') {
    throw new ValidationError('Invalid import format. Only imports with format version 1.0.0 supported.');
  }
}
