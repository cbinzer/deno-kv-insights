import { HandlerContext } from '$fresh/src/server/types.ts';
import EntriesPage from '../islands/entriesPage.tsx';
import { getAllEntries } from '../lib/kv/kvEntryService.ts';
import { HTTPStrippedKvEntries } from '../lib/kv/models.ts';
import { createHTTPStrippedKvEntries } from './api/entries/index.ts';

export const handler = async (request: Request, context: HandlerContext) => {
  const first = 25;
  const entries = await getAllEntries({ first: first + 1 });
  const httpEntries = createHTTPStrippedKvEntries(entries, 0, first);

  return context.render({ entries: httpEntries });
};

export default function EntriesPageRoute(props: { data: { entries: HTTPStrippedKvEntries } }) {
  return <EntriesPage initialEntries={props.data.entries} />;
}
