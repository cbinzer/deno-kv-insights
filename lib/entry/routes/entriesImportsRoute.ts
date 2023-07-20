import { Handlers } from '$fresh/src/server/types.ts';
import { Status } from '../../../deps.ts';
import { mapToHTTPError } from '../../common/httpUtils.ts';
import { importEntries } from '../services/entryImportService.ts';

export const handler: Handlers = {
  POST: async (request): Promise<Response> => {
    try {
      const result = await importEntries(request.body as ReadableStream);
      return new Response(JSON.stringify(result), {
        status: Status.OK,
        headers: {
          'content-type': 'application/json',
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
