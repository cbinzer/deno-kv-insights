import { KVInsightsAppRoute, KVInsightsAppRouteHandlers } from './entry/routes/kvInsightsRoute.tsx';
import { handler as EntriesRouteHandler } from './entry/routes/entriesRoute.ts';
import { handler as EntryRouteHandler } from './entry/routes/entryRoute.ts';
import { handler as EntriesExportRouteHandler } from './entry/routes/entriesExportRoute.ts';
import EntriesManagement from './entry/islands/entriesManagement.tsx';

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
    ],
    islands: [{
      name: 'EntriesManagement',
      path: './entry/islands/entriesManagement.tsx',
      component: EntriesManagement,
    }],
    location: import.meta.url,
  };
}
