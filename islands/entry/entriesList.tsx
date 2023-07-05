import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { getAllEntries } from '../../lib/entry/entryClientService.ts';
import { HTTPStrippedEntries, StrippedEntry } from '../../lib/entry/models.ts';
import { convertKeyToString, getValueTypeColorClass } from '../../lib/entry/utils.ts';

const EntriesList: FunctionComponent<EntriesListProps> = (
  { initialEntries, keyPrefix = '', onSelect = () => {}, doReload = false },
) => {
  const [initialized, setInitialized] = useState(false);
  const [entries, setEntries] = useState(initialEntries);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<StrippedEntry>();

  useEffect(() => {
    if (doReload) {
      reloadEntries().then();
    }
  }, [doReload]);

  useEffect(() => {
    if (initialized) {
      reloadEntries(25).then();
    } else {
      setInitialized(true);
    }
  }, [keyPrefix]);

  const loadMoreEntries = () => {
    if (entries.pageInfo.hasNextPage && !isLoading) {
      setIsLoading(true);
      getAllEntries({
        first: 25,
        after: entries.pageInfo.endCursor,
      }, { keyPrefix }).then((nextEntries) => {
        setEntries({
          ...nextEntries,
          entries: [...entries.entries, ...nextEntries.entries],
        });
        setIsLoading(false);
      });
    }
  };

  const reloadEntries = async (size?: number) => {
    setIsLoading(true);

    let first = entries.entries.length > 25 ? entries.entries.length : 25;
    if (size) {
      first = size;
    }

    const reloadedEntries = await getAllEntries({ first }, { keyPrefix });
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
                  <td>{convertKeyToString(entry.key)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      {isLoading
        ? (
          <div class='text-center'>
            <div class='spinner-border text-secondary'>
              <span class='visually-hidden'>Loading...</span>
            </div>
          </div>
        )
        : null}
    </div>
  );
};

export interface EntriesListProps {
  initialEntries: HTTPStrippedEntries;
  keyPrefix?: string;
  doReload?: boolean;
  onSelect?: (entry: StrippedEntry) => void;
}

export default EntriesList;
