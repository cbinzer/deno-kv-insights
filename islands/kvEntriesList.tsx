import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { getAllEntries } from '../lib/kv/kvEntryClientService.ts';
import { HTTPStrippedKvEntries, KvValueType, StrippedKvEntry } from '../lib/kv/models.ts';

const KvEntriesList: FunctionComponent<KvEntriesListProps> = ({ initialEntries }) => {
  const [entries, setEntries] = useState(initialEntries);
  const [isLoading, setIsLoading] = useState(false);
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

  const loadMoreEntriesOnScrollEnd = (event: Event) => {
    const element = event.target as HTMLDivElement;
    const scrollEndReached = element.offsetHeight + element.scrollTop >= element.scrollHeight;
    if (scrollEndReached) {
      loadMoreEntries();
    }
  };

  const getBadgeColor = (valueType: KvValueType): string => {
    switch (valueType) {
      case KvValueType.NUMBER:
        return 'text-bg-primary';
      case KvValueType.STRING:
        return 'text-bg-secondary';
      case KvValueType.BOOLEAN:
        return 'text-bg-success';
      case KvValueType.OBJECT:
        return 'text-bg-danger';
      case KvValueType.UNDEFINED:
        return 'text-bg-warning';
      case KvValueType.NULL:
        return 'text-bg-info';
      default:
        return 'text-bg-light';
    }
  };

  return (
    <div class='kv-entries-list'>
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
                onClick={() => setSelectedEntry(entry)}
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
  );
};

export interface KvEntriesListProps {
  initialEntries: HTTPStrippedKvEntries;
}

export default KvEntriesList;
