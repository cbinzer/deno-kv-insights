import { Handlers } from '$fresh/src/server/types.ts';
import { Status } from '../../../deps.ts';
import { mapToHTTPError } from '../../common/httpUtils.ts';
import { EntryKey } from '../models.ts';
import { replace, revive } from '../utils.ts';
import { createEntriesExport } from '../entryExportService.ts';

export const handler: Handlers = {
  GET: async (request): Promise<Response> => {
    try {
      const url = new URL(request.url);
      const base64Keys = url.searchParams.get('keys') as string;
      const keys: EntryKey[] = JSON.parse(atob(base64Keys), revive);
      const entriesExport = await createEntriesExport({ keys });
      const created = entriesExport.created;
      const filename = `entries-export_${created.toISOString().replaceAll(/T.*/g, '')}.json`;

      return new Response(JSON.stringify(entriesExport, replace), {
        status: Status.Created,
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
