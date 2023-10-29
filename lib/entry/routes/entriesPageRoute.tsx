import Page from '../../common/components/page.tsx';
import EntriesManagement from '../islands/entriesManagement.tsx';
import { EntryFilter, EntryKey } from '../models.ts';
import { getAllEntries } from '../services/entryService.ts';
import { convertReadableKeyStringToKey } from '../utils.ts';
import { createHTTPStrippedEntries } from './apiEntriesRoute.ts';

export async function EntriesPageRoute(request: Request) {
  const url = new URL(request.url);
  const keyPrefixAsString = url.searchParams.get('keyPrefix');
  let filter: EntryFilter | undefined = undefined;

  if (keyPrefixAsString) {
    const initialKeyPrefix = convertReadableKeyStringToKey(keyPrefixAsString);
    filter = { keyPrefix: initialKeyPrefix };
  }

  const first = 35;
  const entries = await getAllEntries(filter, { first: first + 1 });
  const httpEntries = createHTTPStrippedEntries(entries, 0, first);

  return (
    <Page currentRoute={'/kv-insights'}>
      <EntriesManagement initialEntries={httpEntries} initialKeyPrefix={keyPrefixAsString ?? undefined} />
    </Page>
  );
}
