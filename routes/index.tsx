import { HandlerContext } from '$fresh/src/server/types.ts';
import EntriesPage from '../islands/entriesPage.tsx';
import { getAllEntries } from '../lib/entry/entryService.ts';
import { HTTPStrippedEntries } from '../lib/entry/models.ts';
import { createHTTPStrippedEntries } from './api/entries/index.ts';

export const handler = async (_, context: HandlerContext) => {
  const first = 25;
  const entries = await getAllEntries({ first: first + 1 });
  const httpEntries = createHTTPStrippedEntries(entries, 0, first);

  return context.render({ entries: httpEntries });
};

export default function EntriesPageRoute(props: { data: { entries: HTTPStrippedEntries } }) {
  return <EntriesPage initialEntries={props.data.entries} />;
}
