import { Handlers } from '$fresh/server.ts';
import { mapToHTTPError } from '../../common/httpUtils.ts';
import { deleteEntryByCursor, getEntryByCursor, updateEntry } from '../entryService.ts';
import { Entry, EntryForUpdate } from '../models.ts';
import { replace, revive } from '../utils.ts';

export const handler: Handlers = {
  GET: async (request, context): Promise<Response> => {
    try {
      const entry = await getEntryByCursor(context.params.cursor);
      return new Response(JSON.stringify(removeUndefinedValue(entry), replace));
    } catch (e) {
      console.error(e);

      const httpError = mapToHTTPError(e);
      return Response.json(httpError, {
        status: httpError.status,
      });
    }
  },

  PUT: async (request, context): Promise<Response> => {
    try {
      const cursor = context.params.cursor;
      const entry = await request.text().then((text) => JSON.parse(text, revive)) as Omit<
        EntryForUpdate,
        'cursor'
      >;
      const updatedEntry = await updateEntry({ ...entry, cursor });

      return new Response(JSON.stringify(removeUndefinedValue(updatedEntry), replace));
    } catch (e) {
      console.error(e);

      const httpError = mapToHTTPError(e);
      return Response.json(httpError, {
        status: httpError.status,
      });
    }
  },

  DELETE: async (request, context): Promise<Response> => {
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

function removeUndefinedValue(entry: Entry): Entry {
  const newEntry: Entry = {
    ...entry,
  };

  if (newEntry.value === undefined) {
    delete newEntry.value;
  }

  return newEntry;
}
