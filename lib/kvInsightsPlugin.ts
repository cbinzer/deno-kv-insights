import { Plugin } from '$fresh/server.ts';
import { setKv } from './common/db.ts';
import { KVInsightsPluginOptions } from './common/models.ts';
import { handler as StyleRouteHandler } from './common/routes/styleRoute.ts';
import { handler as APIEntriesExportRouteHandler } from './entry/routes/apiEntriesExportRoute.ts';
import { handler as APIEntriesImportsRouteHandler } from './entry/routes/apiEntriesImportsRoute.ts';
import { handler as APIEntriesRouteHandler } from './entry/routes/apiEntriesRoute.ts';
import { handler as APIEntryRouteHandler } from './entry/routes/apiEntryRoute.ts';
import { EntriesPageRoute } from './entry/routes/entriesPageRoute.tsx';
import EntryPageRoute from './entry/routes/entryPageRoute.tsx';
import { handler as APIQueueRouteHandler } from './queue/routes/apiQueueRoute.ts';
import { QueuePageRoute } from './queue/routes/queuePageRoute.tsx';

export function kvInsightsPlugin(options: KVInsightsPluginOptions = {}): Plugin {
  initKv(options.kv);

  const basePath = '/kv-insights';
  return {
    name: 'deno-kv-insights',
    routes: [
      {
        path: basePath,
        component: EntriesPageRoute as any,
      },
      {
        path: `${basePath}/entries`,
        component: EntriesPageRoute as any,
      },
      {
        path: `${basePath}/entries/[cursor]`,
        component: EntryPageRoute as any,
      },
      {
        path: `${basePath}/queue`,
        component: QueuePageRoute,
      },
      {
        path: `${basePath}/assets/style`,
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

function initKv(existingKvInstance?: Deno.Kv) {
  if (existingKvInstance) {
    setKv(existingKvInstance);
  } else {
    Deno.openKv().then((kv) => setKv(kv));
  }
}
