import Page from '../../common/components/page.tsx';
import EntriesManagement from '../islands/entriesManagement.tsx';
import { getAllEntries } from '../services/entryService.ts';
import { createHTTPStrippedEntries } from './apiEntriesRoute.ts';

export async function EntriesPageRoute() {
  const first = 35;
  const entries = await getAllEntries(undefined, { first: first + 1 });
  const httpEntries = createHTTPStrippedEntries(entries, 0, first);

  return (
    <Page currentRoute={'/kv-insights'}>
      <EntriesManagement initialEntries={httpEntries} />
    </Page>
  );
}
