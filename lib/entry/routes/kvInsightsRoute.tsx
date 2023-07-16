import { HandlerContext, Handlers, RouteConfig } from '$fresh/src/server/types.ts';
import { HTTPStrippedEntries } from '../models.ts';
import { getAllEntries } from '../entryService.ts';
import { createHTTPStrippedEntries, handler as entriesHandler } from './entriesRoute.ts';
import { handler as entryHandler } from './entryRoute.ts';
import { handler as entriesExportHandler } from './entriesExportRoute.ts';
import KVInsightsApp from '../components/kvInsightsApp.tsx';

export function KVInsightsAppRoute(props: { data: { entries: HTTPStrippedEntries } }) {
  return <KVInsightsApp initialEntries={props.data.entries} />;
}

export const KVInsightsAppRouteHandlers: Handlers = {
  GET: async (request, context: HandlerContext) => {
    if (context.params.cursor) {
      return entryHandler.GET(request, context);
    }

    if (request.url.includes('/kv-insights/api/entries')) {
      return entriesHandler.GET(request, context);
    }

    const first = 25;
    const entries = await getAllEntries(undefined, { first: first + 1 });
    const httpEntries = createHTTPStrippedEntries(entries, 0, first);

    return context.render({ entries: httpEntries });
  },

  POST: async (request, context: HandlerContext) => {
    if (request.url.includes('/kv-insights/api/entries/export')) {
      return entriesExportHandler.POST(request, context);
    }

    if (request.url.includes('/kv-insights/api/entries')) {
      return entriesHandler.POST(request, context);
    }

    return context.renderNotFound();
  },

  PUT: async (request, context: HandlerContext) => {
    if (request.url.includes('/kv-insights/api/entries')) {
      return entryHandler.PUT(request, context);
    }

    return context.renderNotFound();
  },

  DELETE: async (request, context: HandlerContext) => {
    if (context.params.cursor) {
      return entryHandler.DELETE(request, context);
    }

    return entriesHandler.DELETE(request, context);
  },
};

export const KVInsightsAppRouteConfig: RouteConfig = {
  routeOverride: '/kv-insights(/api/entries)?/:cursor(.*)?',
};
