import { HandlerContext } from '$fresh/src/server/types.ts';
import KvEntriesList from '../islands/kvEntriesList.tsx';
import { getAllEntries } from '../lib/kv/kvEntryService.ts';
import { HTTPStrippedKvEntries } from '../lib/kv/models.ts';
import { createHTTPStrippedKvEntries } from './api/entries/index.ts';

export const handler = async (request: Request, context: HandlerContext) => {
  const first = 25;
  const entries = await getAllEntries({ first: first + 1 });
  const httpEntries = createHTTPStrippedKvEntries(entries, 0, first);

  return context.render({ entries: httpEntries });
};

export default function MainPage(props: { data: { entries: HTTPStrippedKvEntries } }) {
  return <KvEntriesList initialEntries={props.data.entries} />;
}
