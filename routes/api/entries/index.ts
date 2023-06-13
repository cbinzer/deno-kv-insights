import { Handlers } from '$fresh/src/server/types.ts';
import { getAllEntries } from '../../../lib/kv/kvEntryService.ts';
import { HTTPStrippedKvEntries, Pagination, StrippedKvEntry } from '../../../lib/kv/models.ts';

export const handler: Handlers = {
  GET: async (request: Request): Promise<Response> => {
    const pagination = createPagination(request.url);
    const first = pagination.first as number;
    const entries = await getAllEntries({ ...pagination, first: first + 1 });
    const httpEntries = createHTTPStrippedKvEntries(entries, 0, first);

    return new Response(JSON.stringify(httpEntries));
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

export function createHTTPStrippedKvEntries(
  entries: StrippedKvEntry[],
  totalCount: number,
  first: number,
): HTTPStrippedKvEntries {
  const slicedEntries = entries.slice(0, first);

  return {
    pageInfo: {
      hasNextPage: entries.length > first,
      endCursor: slicedEntries.at(-1)?.id,
    },
    entries: slicedEntries,
    totalCount,
  };
}
