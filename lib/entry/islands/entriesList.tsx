import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { getAllEntries } from '../services/entryClientService.ts';
import { HTTPStrippedEntries, StrippedEntry } from '../models.ts';
import { convertKeyToString, getValueTypeColorClass } from '../utils.ts';
import PencilIcon from '../../common/components/icon/pencilIcon.tsx';

const EntriesList: FunctionComponent<EntriesListProps> = (
  {
    initialEntries,
    keyPrefix = '',
    selectedEntries = [],
    onSelect = () => {},
    onSelectMany = () => {},
    doReload = false,
  },
) => {
  const [initialized, setInitialized] = useState(false);
  const [entries, setEntries] = useState(initialEntries);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<StrippedEntry>();
  const [selectedEntryCursors, setSelectedEntryCursors] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (doReload) {
      reloadEntries().then();
    }
  }, [doReload]);

  useEffect(() => {
    if (initialized) {
      reloadEntries(35).then();
      setSelectedEntry(undefined);
    } else {
      setInitialized(true);
    }
  }, [keyPrefix]);

  useEffect(() => setSelectedEntryCursors(new Set(selectedEntries.map((entry) => entry.cursor))), selectedEntries);

  const loadMoreEntries = () => {
    if (entries.pageInfo.hasNextPage && !isLoading) {
      setIsLoading(true);
      getAllEntries({
        first: 35,
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

    let first = entries.entries.length > 35 ? entries.entries.length : 35;
    if (size) {
      first = size;
    }

    const reloadedEntries = await getAllEntries({ first }, { keyPrefix });
    setEntries(reloadedEntries);

    setIsLoading(false);
  };

  const loadMoreEntriesOnScrollEnd = (event: Event) => {
    const element = event.target as HTMLDivElement;
    const rowHeight = 20;
    const scrollEndReached = element.offsetHeight + element.scrollTop + rowHeight >= element.scrollHeight;

    if (scrollEndReached) {
      loadMoreEntries();
    }
  };

  const selectEntry = (entry: StrippedEntry) => {
    setSelectedEntry(entry);
    onSelect(entry);
  };

  const toggleAllSelectedEntryCursors = () => {
    if (selectedEntryCursors.size === entries.entries.length) {
      setSelectedEntryCursors(new Set());
      onSelectMany([]);
    } else {
      setSelectedEntryCursors(new Set(entries.entries.map((entry) => entry.cursor)));
      onSelectMany(entries.entries);
    }
  };

  const toggleSelectedEntryCursor = (cursor: string) => {
    const newSelectedCursors = new Set(selectedEntryCursors);
    if (newSelectedCursors.has(cursor)) {
      newSelectedCursors.delete(cursor);
    } else {
      newSelectedCursors.add(cursor);
    }

    setSelectedEntryCursors(newSelectedCursors);
    onSelectMany(entries.entries.filter((entry) => newSelectedCursors.has(entry.cursor)));
  };

  const openEntryDetailPage = (cursor: string) => {
    window.location = `/kv-insights/entries/${cursor}`;
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
                <th class='select-col' scope='col'>
                  <input
                    class='form-check-input'
                    type='checkbox'
                    checked={selectedEntryCursors.size === entries.entries.length}
                    onChange={toggleAllSelectedEntryCursors}
                  />
                </th>
                <th class='type-col' scope='col'>Type</th>
                <th class='key-col' scope='col'>Key</th>
              </tr>
            </thead>

            <tbody>
              {entries.entries.map((entry) => (
                <tr
                  key={entry.cursor}
                  class={`table-row ${entry.cursor === selectedEntry?.cursor ? 'table-active' : ''}`}
                  onClick={() => openEntryDetailPage(entry.cursor)}
                >
                  <td>
                    <input
                      class='form-check-input'
                      type='checkbox'
                      checked={selectedEntryCursors.has(entry.cursor)}
                      onClick={(event) => event.stopPropagation()}
                      onChange={() => toggleSelectedEntryCursor(entry.cursor)}
                    />
                  </td>
                  <td>
                    <span class={`badge ${getValueTypeColorClass(entry.valueType)}`}>{entry.valueType}</span>
                  </td>
                  <td class='text-truncate'>{convertKeyToString(entry.key)}</td>
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
  selectedEntries?: StrippedEntry[];
  onSelect?: (entry: StrippedEntry) => void;
  onSelectMany?: (entry: StrippedEntry[]) => void;
}

export default EntriesList;
