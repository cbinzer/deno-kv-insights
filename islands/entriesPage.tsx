import { FunctionComponent } from 'preact';
import { HTTPStrippedKvEntries, KvEntry } from '../lib/kv/models.ts';
import { useState } from 'preact/hooks';
import { getEntryByCursor } from '../lib/kv/kvEntryClientService.ts';
import KvEntriesList from './kvEntriesList.tsx';
import EntryDetail from './entryDetail.tsx';

const EntriesPage: FunctionComponent<EntriesPageProps> = ({ initialEntries }) => {
  const [selectedEntry, setSelectedEntry] = useState<KvEntry | undefined>(undefined);
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
      <KvEntriesList initialEntries={initialEntries} onSelect={(entry) => loadEntry(entry.id)} doReload={doReload} />
      <EntryDetail entry={selectedEntry} onDelete={removeSelectedEntry} />
    </div>
  );
};

export interface EntriesPageProps {
  initialEntries: HTTPStrippedKvEntries;
}

export default EntriesPage;
