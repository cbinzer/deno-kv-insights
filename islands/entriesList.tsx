import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { getAllEntries } from '../lib/entry/entryClientService.ts';
import { HTTPStrippedEntries, StrippedEntry } from '../lib/entry/models.ts';
import { getValueTypeColorClass } from '../lib/entry/utils.ts';

const EntriesList: FunctionComponent<EntriesListProps> = (
  { initialEntries, onSelect = () => {}, doReload = false },
) => {
  const [entries, setEntries] = useState(initialEntries);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<StrippedEntry>();

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

  const reloadEntries = async () => {
    setIsLoading(true);

    let first = entries.entries.length > 25 ? entries.entries.length : 25;
    const reloadedEntries = await getAllEntries({ first });
    setEntries(reloadedEntries);

    setIsLoading(false);
  };

  const loadMoreEntriesOnScrollEnd = (event: Event) => {
    const element = event.target as HTMLDivElement;
    const scrollEndReached = element.offsetHeight + element.scrollTop >= element.scrollHeight;
    if (scrollEndReached) {
      loadMoreEntries();
    }
  };

  const selectEntry = (entry: StrippedEntry) => {
    setSelectedEntry(entry);
    onSelect(entry);
  };

  useEffect(() => {
    if (doReload) {
      reloadEntries().then();
    }
  }, [doReload]);

  return (
    <div class='entries-list' onScroll={loadMoreEntriesOnScrollEnd}>
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
              </tr>
            </thead>

            <tbody>
              {entries.entries.map((entry) => (
                <tr
                  key={entry.cursor}
                  class={`table-row ${entry.cursor === selectedEntry?.cursor ? 'table-active' : ''}`}
                  onClick={() => selectEntry(entry)}
                >
                  <td>
                    <span class={`badge ${getValueTypeColorClass(entry.valueType)}`}>{entry.valueType}</span>
                  </td>
                  <td>[{entry.key.join(', ')}]</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </div>
  );
};

export interface EntriesListProps {
  initialEntries: HTTPStrippedEntries;
  doReload?: boolean;
  onSelect?: (entry: StrippedEntry) => void;
}

export default EntriesList;
