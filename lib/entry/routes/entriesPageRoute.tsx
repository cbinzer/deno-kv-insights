import { HandlerContext, Handlers } from '$fresh/src/server/types.ts';
import Page from '../../common/components/page.tsx';
import EntriesManagement from '../islands/entriesManagement.tsx';
import { HTTPStrippedEntries } from '../models.ts';
import { getAllEntries } from '../services/entryService.ts';
import { createHTTPStrippedEntries } from './apiEntriesRoute.ts';

export const EntriesPageRouteHandlers: Handlers = {
  GET: async (_, context: HandlerContext) => {
    const first = 35;
    const entries = await getAllEntries(undefined, { first: first + 1 });
    const httpEntries = createHTTPStrippedEntries(entries, 0, first);

    return context.render({ entries: httpEntries });
  },
};

export function EntriesPageRoute(props: { data: { entries: HTTPStrippedEntries } }) {
  return (
    <Page currentRoute={'/kv-insights'}>
      <EntriesManagement initialEntries={props.data.entries} />
    </Page>
  );
}
