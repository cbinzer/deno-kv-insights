import { Handlers } from '$fresh/src/server/types.ts';
import { Status } from '$std/http/http_status.ts';
import { mapToHTTPError } from '../../../lib/common/httpUtils.ts';
import { createEntry, getAllEntries } from '../../../lib/entry/entryService.ts';
import { HTTPStrippedEntries, StrippedEntry } from '../../../lib/entry/models.ts';
import { Pagination } from '../../../lib/common/models.ts';
import { keyReviver } from '../../../lib/entry/utils.ts';

export const handler: Handlers = {
  GET: async (request): Promise<Response> => {
    const pagination = createPagination(request.url);
    const first = pagination.first as number;
    const entries = await getAllEntries({ ...pagination, first: first + 1 });
    const httpEntries = createHTTPStrippedEntries(entries, 0, first);

    return new Response(JSON.stringify(httpEntries));
  },

  POST: async (request): Promise<Response> => {
    try {
      const entry = (await request.text().then((text) => JSON.parse(text, keyReviver))) as EntryForCreation;
      const newEntry = await createEntry(entry);

      return Response.json(newEntry, { status: Status.Created });
    } catch (e) {
      console.error(e);

      const httpError = mapToHTTPError(e);
      return Response.json(httpError, {
        status: httpError.status,
      });
    }
  },
};

function createPagination(urlString: string): Pagination {
  const url = new URL(urlString);
  const pagination: Pagination = { first: 25 };

  const firstParam = url.searchParams.get('first');
  if (firstParam) {
    const first = parseInt(firstParam);
    if (first) {
      pagination.first = first;
    }
  }

  const afterParam = url.searchParams.get('after');
  if (afterParam) {
    pagination.after = afterParam;
  }

  return pagination;
}

export function createHTTPStrippedEntries(
  entries: StrippedEntry[],
  totalCount: number,
  first: number,
): HTTPStrippedEntries {
  const slicedEntries = entries.slice(0, first);

  return {
    pageInfo: {
      hasNextPage: entries.length > first,
      endCursor: slicedEntries.at(-1)?.cursor,
    },
    entries: slicedEntries,
    totalCount,
  };
}
