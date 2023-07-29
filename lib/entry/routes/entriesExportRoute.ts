import { Handlers } from '$fresh/src/server/types.ts';
import { Status } from '../../../deps.ts';
import { mapToHTTPError } from '../../common/httpUtils.ts';
import { EntryKey } from '../models.ts';
import { revive } from '../utils.ts';
import { createEntriesExport } from '../services/entryExportService.ts';

export const handler: Handlers = {
  GET: (request): Response => {
    try {
      const url = new URL(request.url);
      const base64Keys = url.searchParams.get('keys') as string;
      const keys: EntryKey[] = JSON.parse(atob(base64Keys), revive);
      const created = new Date();
      const filename = `entries-export_${created.toISOString().replaceAll(/T.*/g, '')}.jsonl`;

      const entriesExport = createEntriesExport({ created, keys });
      return new Response(entriesExport, {
        status: Status.OK,
        headers: {
          'content-type': 'application/json',
          'content-disposition': `attachment; filename="${filename}"`,
        },
      });
    } catch (e) {
      console.error(e);

      const httpError = mapToHTTPError(e);
      return Response.json(httpError, {
        status: httpError.status,
      });
    }
  },
};
