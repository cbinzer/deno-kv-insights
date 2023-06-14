import { FunctionComponent } from 'preact';
import { HTTPStrippedKvEntries, KvEntry } from '../lib/kv/models.ts';
import { useState } from 'preact/hooks';
import { getEntryByCursor } from '../lib/kv/kvEntryClientService.ts';
import KvEntriesList from './kvEntriesList.tsx';
import EntryDetail from './entryDetail.tsx';

const EntriesPage: FunctionComponent<EntriesPageProps> = ({ initialEntries }) => {
  const [selectedEntry, setSelectedEntry] = useState<KvEntry | undefined>(undefined);

  const loadEntry = async (cursor: string) => {
    const entry = await getEntryByCursor(cursor);
    console.log(entry);

    setSelectedEntry(entry);
  };

  return (
    <div class='entries-container'>
      <KvEntriesList initialEntries={initialEntries} onSelect={(entry) => loadEntry(entry.id)} />
      <EntryDetail entry={selectedEntry} />
    </div>
  );
};

export interface EntriesPageProps {
  initialEntries: HTTPStrippedKvEntries;
}

export default EntriesPage;
