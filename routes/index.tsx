import { HandlerContext } from '$fresh/src/server/types.ts';
import { useState } from 'preact/hooks';
import EntryDetail from '../islands/entryDetail.tsx';
import KvEntriesList from '../islands/kvEntriesList.tsx';
import { getAllEntries } from '../lib/kv/kvEntryService.ts';
import { HTTPStrippedKvEntries, KvEntry } from '../lib/kv/models.ts';
import { createHTTPStrippedKvEntries } from './api/entries/index.ts';
import { getEntryByCursor } from '../lib/kv/kvEntryClientService.ts';
import EntriesPage from '../islands/entriesPage.tsx';

export const handler = async (request: Request, context: HandlerContext) => {
  const first = 25;
  const entries = await getAllEntries({ first: first + 1 });
  const httpEntries = createHTTPStrippedKvEntries(entries, 0, first);

  return context.render({ entries: httpEntries });
};

export default function EntriesPageRoute(props: { data: { entries: HTTPStrippedKvEntries } }) {
  return <EntriesPage initialEntries={props.data.entries} />;
}
