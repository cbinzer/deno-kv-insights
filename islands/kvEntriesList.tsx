import { FunctionComponent } from 'preact';
import { HTTPStrippedKvEntries } from '../routes/api/entries/index.ts';

const KvEntriesList: FunctionComponent<KvEntriesListProps> = ({ httpEntries }) => {
  console.log(httpEntries);
  return (
    <div>
      {httpEntries.entries.map((entry) => <pre>{JSON.stringify(entry, undefined, 2)}</pre>)}
    </div>
  );
};

export interface KvEntriesListProps {
  httpEntries: HTTPStrippedKvEntries;
}

export default KvEntriesList;
