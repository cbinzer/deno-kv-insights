import { Handlers } from '$fresh/server.ts';
import { mapToHTTPError } from '../../../lib/common/httpUtils.ts';
import { getEntryByCursor } from '../../../lib/kv/kvEntryService.ts';

export const handler: Handlers = {
  GET: async (_, context): Promise<Response> => {
    try {
      const entry = await getEntryByCursor(context.params.cursor);
      return new Response(JSON.stringify(entry));
    } catch (e) {
      console.error(e);

      const httpError = mapToHTTPError(e);
      return Response.json(httpError, {
        status: httpError.status,
      });
    }
  },
};
