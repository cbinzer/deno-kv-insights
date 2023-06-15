import { asset } from '$fresh/runtime.ts';
import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { KvEntry } from '../lib/kv/models.ts';
import { getBadgeColor } from '../lib/kv/utils.ts';
import DeleteEntryModal from './deleteEntryModal.tsx';

const EntryDetail: FunctionComponent<EntryDetailProps> = ({ entry, onDelete = () => {} }) => {
  const [isDeleteEntryModalOpen, setIsDeleteEntryModalOpen] = useState(false);

  if (!entry) {
    return (
      <div class='entry-detail-empty'>
        <p class='info-text fs-4'>No entry selected</p>
      </div>
    );
  }

  const saveEntry = (event: Event) => {
    event.preventDefault();
  };

  const deleteEntry = () => {
    setIsDeleteEntryModalOpen(false);
    onDelete();
  };

  return (
    <div class='entry-detail'>
      <div class='header'>
        <p class='h5'>
          <span class={`badge ${getBadgeColor(entry.valueType)}`}>{entry.valueType}</span> [{entry.key.join(', ')}]
        </p>
        <button class='btn' onClick={() => setIsDeleteEntryModalOpen(true)}>
          <img src={asset('icons/trash3.svg')} />
        </button>
      </div>

      <form class='form' onSubmit={saveEntry}>
        <div class='mb-3'>
          <label for='cursor' class='form-label'>Cursor</label>
          <input type='text' class='form-control' id='cursor' disabled={true} value={entry.id} />
        </div>
        <div class='mb-3'>
          <label for='version' class='form-label'>Version</label>
          <input type='text' class='form-control' id='version' disabled={true} value={entry.version} />
        </div>
        <div class='mb-3'>
          <label for='value' class='form-label'>Value</label>
          <textarea class='form-control value-form-control' id='value' value={entry.value?.toString()}></textarea>
        </div>

        <div>
          <button type='submit' class='btn btn-primary btn-save float-end'>Save</button>
        </div>
      </form>

      <DeleteEntryModal
        open={isDeleteEntryModalOpen}
        entry={entry}
        onDelete={deleteEntry}
        onClose={() => setIsDeleteEntryModalOpen(false)}
      />
    </div>
  );
};

export interface EntryDetailProps {
  entry: KvEntry | undefined;
  onDelete?: () => void;
}

export default EntryDetail;
