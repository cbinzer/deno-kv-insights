import { Handlers } from '$fresh/src/server/types.ts';
import { Status } from '$std/http/http_status.ts';
import { EntryAlreadyExistsError, EntryNotFoundError, ValidationError } from '../../../lib/common/errors.ts';
import { createEntry, getAllEntries } from '../../../lib/kv/kvEntryService.ts';
import { HTTPError, HTTPStrippedKvEntries, KvKeyPart, Pagination, StrippedKvEntry } from '../../../lib/kv/models.ts';

export const handler: Handlers = {
  GET: async (request): Promise<Response> => {
    const pagination = createPagination(request.url);
    const first = pagination.first as number;
    const entries = await getAllEntries({ ...pagination, first: first + 1 });
    const httpEntries = createHTTPStrippedKvEntries(entries, 0, first);

    return new Response(JSON.stringify(httpEntries));
  },

  POST: async (request): Promise<Response> => {
    try {
      const { key, value } = (await request.json()) as { key: KvKeyPart[]; value: unknown };
      const newEntry = await createEntry(key, value);

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

function mapToHTTPError(error: Error): HTTPError {
  if (error instanceof ValidationError) {
    return {
      status: Status.BadRequest,
      message: error.message,
    };
  }

  if (error instanceof EntryNotFoundError) {
    return {
      status: Status.NotFound,
      message: error.message,
    };
  }

  if (error instanceof EntryAlreadyExistsError) {
    return {
      status: Status.Conflict,
      message: error.message,
    };
  }

  return {
    status: Status.InternalServerError,
    message: 'An unknown error occurred.',
  };
}
