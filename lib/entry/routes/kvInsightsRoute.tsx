import { HandlerContext } from '$fresh/src/server/types.ts';
import { HTTPStrippedEntries } from '../models.ts';
import { getAllEntries } from '../entryService.ts';
import { createHTTPStrippedEntries } from '../../../routes/api/entries/index.ts';
import KVInsightsApp from '../components/kvInsightsApp.tsx';

export default function KVInsightsAppRoute(props: { data: { entries: HTTPStrippedEntries } }) {
  return <KVInsightsApp initialEntries={props.data.entries} />;
}

export const handler = async (_, context: HandlerContext) => {
  const first = 25;
  const entries = await getAllEntries(undefined, { first: first + 1 });
  const httpEntries = createHTTPStrippedEntries(entries, 0, first);

  return context.render({ entries: httpEntries });
};
