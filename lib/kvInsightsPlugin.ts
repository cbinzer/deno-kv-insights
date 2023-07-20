import { KVInsightsAppRoute, KVInsightsAppRouteHandlers } from './entry/routes/kvInsightsRoute.tsx';
import { handler as EntriesRouteHandler } from './entry/routes/entriesRoute.ts';
import { handler as EntryRouteHandler } from './entry/routes/entryRoute.ts';
import { handler as EntriesExportRouteHandler } from './entry/routes/entriesExportRoute.ts';
import { handler as EntriesImportsRouteHandler } from './entry/routes/entriesImportsRoute.ts';

export function kvInsightsPlugin() {
  const basePath = '/kv-insights';

  return {
    name: 'deno-kv-insights',
    routes: [
      {
        path: basePath,
        handler: KVInsightsAppRouteHandlers,
        component: KVInsightsAppRoute,
      },
      {
        path: `${basePath}/api/entries`,
        handler: EntriesRouteHandler,
      },
      {
        path: `${basePath}/api/entries/[cursor]`,
        handler: EntryRouteHandler,
      },
      {
        path: `${basePath}/api/entries/export`,
        handler: EntriesExportRouteHandler,
      },
      {
        path: `${basePath}/api/entries/imports`,
        handler: EntriesImportsRouteHandler,
      },
    ],
  };
}
