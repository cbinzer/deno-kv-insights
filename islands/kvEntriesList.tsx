import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { getAllEntries } from '../lib/kv/kvEntryClientService.ts';
import { HTTPStrippedKvEntries, StrippedKvEntry } from '../lib/kv/models.ts';
import { getBadgeColor } from '../lib/kv/utils.ts';
import CreateEntryModal from './createEntryModal.tsx';

const KvEntriesList: FunctionComponent<KvEntriesListProps> = (
  { initialEntries, onSelect = () => {}, doReload = false },
) => {
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

  const reloadEntries = async (first: number) => {
    setIsLoading(true);

    const nextEntries = await getAllEntries({ first });
    setEntries(nextEntries);
    setIsLoading(false);
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

  useEffect(() => {
    if (doReload) {
      reloadEntries(entries.entries.length);
    }
  }, [doReload]);

  return (
    <>
      <div class='kv-entries-list'>
        <div class='action-container'>
          <div></div>
          <button class='btn btn-primary' onClick={() => setIsCreateEntryModalOpen(true)}>+ Entry</button>
        </div>

        <div class='table-container' onScroll={loadMoreEntriesOnScrollEnd}>
          {entries.entries.length === 0
            ? (
              <div class='empty-table'>
                <p class='info-text fs-4'>No entries available</p>
              </div>
            )
            : (
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
                      class={`table-row ${entry.id === selectedEntry?.id ? 'table-active' : ''}`}
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
            )}
        </div>
      </div>

      <CreateEntryModal
        open={isCreateEntryModalOpen}
        onClose={() => setIsCreateEntryModalOpen(false)}
        onCreate={() => reloadEntries(entries.entries.length + 1)}
      />
    </>
  );
};

export interface KvEntriesListProps {
  initialEntries: HTTPStrippedKvEntries;
  doReload?: boolean;
  onSelect?: (entry: StrippedKvEntry) => void;
}

export default KvEntriesList;
