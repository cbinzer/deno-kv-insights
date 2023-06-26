import { Handlers } from '$fresh/server.ts';
import { mapToHTTPError } from '../../../lib/common/httpUtils.ts';
import { deleteEntryByCursor, getEntryByCursor, updateEntry } from '../../../lib/entry/entryService.ts';
import { Entry, EntryForUpdate, KeyPart } from '../../../lib/entry/models.ts';
import { convertReadableKeyStringToKey } from '../../../lib/entry/utils.ts';

export const handler: Handlers = {
  GET: async (request, context): Promise<Response> => {
    try {
      const keyPrefix = getKeyPrefix(request.url);
      const entry = await getEntryByCursor(context.params.cursor, keyPrefix);
      return new Response(JSON.stringify(removeUndefinedValue(entry)));
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
      const keyPrefix = getKeyPrefix(request.url);
      const entry = await request.json() as Omit<EntryForUpdate, 'cursor'>;
      const updatedEntry = await updateEntry({ ...entry, cursor }, keyPrefix);

      return new Response(JSON.stringify(removeUndefinedValue(updatedEntry)));
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
      const keyPrefix = getKeyPrefix(request.url);
      await deleteEntryByCursor(context.params.cursor, keyPrefix);
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

function getKeyPrefix(urlString: string): KeyPart[] {
  const url = new URL(urlString);
  let keyPrefix: KeyPart[] = [];
  if (url.searchParams.has('prefix')) {
    keyPrefix = convertReadableKeyStringToKey(url.searchParams.get('prefix'));
  }

  return keyPrefix;
}
