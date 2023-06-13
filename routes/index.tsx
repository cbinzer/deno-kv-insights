import KvEntriesList from '../islands/kvEntriesList.tsx';
import { HandlerContext } from '$fresh/src/server/types.ts';
import { getAllEntries } from '../lib/kv/kvEntryService.ts';
import { createHTTPStrippedKvEntries, HTTPStrippedKvEntries } from './api/entries/index.ts';

export const handler = async (request: Request, context: HandlerContext) => {
  const first = 25;
  const entries = await getAllEntries({ first: first + 1 });
  const httpEntries = createHTTPStrippedKvEntries(entries, 0, first);

  return context.render({ entries: httpEntries });
};

export default function MainPage(props: { data: { entries: HTTPStrippedKvEntries } }) {
  return <KvEntriesList httpEntries={props.data.entries} />;
}
