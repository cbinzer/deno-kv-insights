import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { getEntryByCursor } from '../lib/entry/entryClientService.ts';
import { Entry, HTTPStrippedEntries } from '../lib/entry/models.ts';
import EntriesList from './entriesList.tsx';
import EntryDetail from './entryDetail.tsx';

const EntriesPage: FunctionComponent<EntriesPageProps> = ({ initialEntries }) => {
  const [selectedEntry, setSelectedEntry] = useState<Entry | undefined>(undefined);
  const [doReload, setDoReload] = useState<boolean>(false);

  const loadEntry = async (cursor: string) => {
    const entry = await getEntryByCursor(cursor);
    setDoReload(false);
    setSelectedEntry(entry);
  };

  const removeSelectedEntry = () => {
    setDoReload(true);
    setSelectedEntry(undefined);
  };

  return (
    <div class='entries-container'>
      <EntriesList initialEntries={initialEntries} onSelect={(entry) => loadEntry(entry.cursor)} doReload={doReload} />
      <EntryDetail entry={selectedEntry} onDelete={removeSelectedEntry} />
    </div>
  );
};

export interface EntriesPageProps {
  initialEntries: HTTPStrippedEntries;
}

export default EntriesPage;
