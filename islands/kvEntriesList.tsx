import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { getAllEntries } from '../lib/kv/kvEntryClientService.ts';
import { HTTPStrippedKvEntries, StrippedKvEntry } from '../lib/kv/models.ts';
import { getBadgeColor } from '../lib/kv/utils.ts';
import CreateEntryModal from './createEntryModal.tsx';

const KvEntriesList: FunctionComponent<KvEntriesListProps> = ({ initialEntries, onSelect = () => {} }) => {
  const [entries, setEntries] = useState(initialEntries);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateEntryModalOpen, setIsCreateEntryModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<StrippedKvEntry>();

  const loadMoreEntries = () => {
    if (entries.pageInfo.hasNextPage && !isLoading) {
      setIsLoading(true);
      getAllEntries({
        first: 25,
        after: entries.pageInfo.endCursor,
      }).then((nextEntries) => {
        setEntries({
          ...nextEntries,
          entries: [...entries.entries, ...nextEntries.entries],
        });
        setIsLoading(false);
      });
    }
  };

  const reloadEntries = () => {
    setIsLoading(true);
    getAllEntries({
      first: entries.entries.length + 1,
    }).then((nextEntries) => {
      setEntries(nextEntries);
      setIsLoading(false);
    });
  };

  const loadMoreEntriesOnScrollEnd = (event: Event) => {
    const element = event.target as HTMLDivElement;
    const scrollEndReached = element.offsetHeight + element.scrollTop >= element.scrollHeight;
    if (scrollEndReached) {
      loadMoreEntries();
    }
  };

  const selectEntry = (entry: StrippedKvEntry) => {
    setSelectedEntry(entry);
    onSelect(entry);
  };

  return (
    <>
      <div class='kv-entries-list'>
        <div class='action-container'>
          <div></div>
          <button class='btn btn-primary' onClick={() => setIsCreateEntryModalOpen(true)}>+ Entry</button>
        </div>

        <div class='table-container' onScroll={loadMoreEntriesOnScrollEnd}>
          <table class='table table-hover'>
            <thead class='table-header table-light'>
              <tr>
                <th class='type-col' scope='col'>Type</th>
                <th class='key-col' scope='col'>Key</th>
                <th scope='col'>Cursor</th>
              </tr>
            </thead>
            <tbody>
              {entries.entries.map((entry) => (
                <tr
                  key={entry.id}
                  class={entry.id === selectedEntry?.id ? 'table-active' : ''}
                  onClick={() => selectEntry(entry)}
                >
                  <td>
                    <span class={`badge ${getBadgeColor(entry.valueType)}`}>{entry.valueType}</span>
                  </td>
                  <td>[{entry.key.join(', ')}]</td>
                  <td>{entry.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateEntryModal
        open={isCreateEntryModalOpen}
        onClose={() => setIsCreateEntryModalOpen(false)}
        onCreate={reloadEntries}
      />
    </>
  );
};

export interface KvEntriesListProps {
  initialEntries: HTTPStrippedKvEntries;
  onSelect?: (entry: StrippedKvEntry) => void;
}

export default KvEntriesList;
