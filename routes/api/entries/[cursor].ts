import { Handlers } from '$fresh/server.ts';
import { mapToHTTPError } from '../../../lib/common/httpUtils.ts';
import { deleteEntryByCursor, getEntryByCursor, updateEntryValue } from '../../../lib/entry/entryService.ts';

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

  PATCH: async (request, context): Promise<Response> => {
    try {
      const cursor = context.params.cursor;
      const { value } = await request.json();
      const updatedEntry = await updateEntryValue(cursor, value);

      return new Response(JSON.stringify(updatedEntry));
    } catch (e) {
      console.error(e);

      const httpError = mapToHTTPError(e);
      return Response.json(httpError, {
        status: httpError.status,
      });
    }
  },

  DELETE: async (_, context): Promise<Response> => {
    try {
      await deleteEntryByCursor(context.params.cursor);
      return new Response();
    } catch (e) {
      console.error(e);

      const httpError = mapToHTTPError(e);
      return Response.json(httpError, {
        status: httpError.status,
      });
    }
  },
};
