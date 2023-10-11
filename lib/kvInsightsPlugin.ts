import { handler as APIEntriesExportRouteHandler } from './entry/routes/apiEntriesExportRoute.ts';
import { handler as APIEntriesImportsRouteHandler } from './entry/routes/apiEntriesImportsRoute.ts';
import { handler as APIEntriesRouteHandler } from './entry/routes/apiEntriesRoute.ts';
import { handler as APIEntryRouteHandler } from './entry/routes/apiEntryRoute.ts';
import { handler as APIQueueRouteHandler } from './queue/routes/apiQueueRoute.ts';
import { handler as StyleRouteHandler } from './common/routes/styleRoute.ts';
import { EntriesPageRoute, EntriesPageRouteHandlers } from './entry/routes/entriesRoute.tsx';
import { QueuePageRoute } from './queue/routes/queueRoute.tsx';

export function kvInsightsPlugin() {
  const basePath = '/kv-insights';

  return {
    name: 'deno-kv-insights',
    routes: [
      {
        path: basePath,
        handler: EntriesPageRouteHandlers,
        component: EntriesPageRoute,
      },
      {
        path: `${basePath}/queue`,
        component: QueuePageRoute,
      },
      {
        path: `${basePath}/assets/style.css`,
        handler: StyleRouteHandler,
      },
      {
        path: `${basePath}/api/entries`,
        handler: APIEntriesRouteHandler,
      },
      {
        path: `${basePath}/api/entries/[cursor]`,
        handler: APIEntryRouteHandler,
      },
      {
        path: `${basePath}/api/entries/export`,
        handler: APIEntriesExportRouteHandler,
      },
      {
        path: `${basePath}/api/entries/imports`,
        handler: APIEntriesImportsRouteHandler,
      },
      {
        path: `${basePath}/api/queue`,
        handler: APIQueueRouteHandler,
      },
    ],
  };
}
