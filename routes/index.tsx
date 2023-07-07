import { HandlerContext } from '$fresh/src/server/types.ts';
import { getAllEntries } from '../lib/entry/entryService.ts';
import { HTTPStrippedEntries } from '../lib/entry/models.ts';
import { createHTTPStrippedEntries } from './api/entries/index.ts';
import KVInsightsApp from '../lib/entry/components/kvInsightsApp.tsx';

export default function KVInsightsAppRoute(props: { data: { entries: HTTPStrippedEntries } }) {
  return <KVInsightsApp initialEntries={props.data.entries} />;
}

export const handler = async (_, context: HandlerContext) => {
  const first = 25;
  const entries = await getAllEntries(undefined, { first: first + 1 });
  const httpEntries = createHTTPStrippedEntries(entries, 0, first);

  return context.render({ entries: httpEntries });
};

