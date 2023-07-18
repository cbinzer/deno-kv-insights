import { HandlerContext, Handlers } from '$fresh/src/server/types.ts';
import { HTTPStrippedEntries } from '../models.ts';
import { getAllEntries } from '../services/entryService.ts';
import { createHTTPStrippedEntries } from './entriesRoute.ts';
import KVInsightsApp from '../components/kvInsightsApp.tsx';

export function KVInsightsAppRoute(props: { data: { entries: HTTPStrippedEntries } }) {
  return <KVInsightsApp initialEntries={props.data.entries} />;
}

export const KVInsightsAppRouteHandlers: Handlers = {
  GET: async (request, context: HandlerContext) => {
    const first = 25;
    const entries = await getAllEntries(undefined, { first: first + 1 });
    const httpEntries = createHTTPStrippedEntries(entries, 0, first);

    return context.render({ entries: httpEntries });
  },
};
