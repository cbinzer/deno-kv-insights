import { FunctionComponent } from 'preact';
import { KvEntry } from '../lib/kv/models.ts';

const EntryDetail: FunctionComponent<EntryDetailProps> = ({ entry }) => {
  if (!entry) {
    return (
      <div class='entry-detail'>
        <p class="info-text fs-4">No entry selected</p>
      </div>
    );
  }

  return <div class='entry-detail'></div>;
};

export interface EntryDetailProps {
  entry: KvEntry;
}

export default EntryDetail;
