import { asset } from '$fresh/runtime.ts';
import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { KvEntry, KvValueType } from '../lib/kv/models.ts';
import { getBadgeColor } from '../lib/kv/utils.ts';
import DeleteEntryModal from './deleteEntryModal.tsx';
import { updateEntryValue } from '../lib/kv/kvEntryClientService.ts';

const EntryDetail: FunctionComponent<EntryDetailProps> = ({ entry, onDelete = () => {} }) => {
  const [internalEntry, setInternalEntry] = useState<KvEntry | undefined>(entry);
  const [isDeleteEntryModalOpen, setIsDeleteEntryModalOpen] = useState(false);

  useEffect(() => setInternalEntry(entry), [entry]);

  if (!internalEntry) {
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

  const updateEntry = async () => {
    const updatedEntry = await updateEntryValue(internalEntry.id, internalEntry.value);
    setInternalEntry(updatedEntry);
  };

  const setValue = (event: Event) => {
    const textarea = event.target as HTMLTextAreaElement;
    setInternalEntry((previousEntry) => ({ ...previousEntry as KvEntry, value: textarea.value }));
  };

  const updateSupported = internalEntry.valueType === KvValueType.STRING;

  return (
    <div class='entry-detail'>
      <div class='header'>
        <p class='h5'>
          <span class={`badge ${getBadgeColor(internalEntry.valueType)}`}>{internalEntry.valueType}</span>{' '}
          [{internalEntry.key.join(', ')}]
        </p>
        <button class='btn' onClick={() => setIsDeleteEntryModalOpen(true)}>
          <img src={asset('icons/trash3.svg')} />
        </button>
      </div>

      <form class='form' onSubmit={saveEntry}>
        <div class='mb-3'>
          <label for='cursor' class='form-label'>Cursor</label>
          <input type='text' class='form-control' id='cursor' disabled={true} value={internalEntry.id} />
        </div>
        <div class='mb-3'>
          <label for='version' class='form-label'>Version</label>
          <input type='text' class='form-control' id='version' disabled={true} value={internalEntry.version} />
        </div>
        <div class='mb-3'>
          <label for='value' class='form-label'>Value</label>
          <textarea
            class='form-control value-form-control'
            id='value'
            value={updateSupported ? internalEntry.value?.toString() : ''}
            disabled={!updateSupported}
            onChange={setValue}
          />
        </div>

        <div>
          <button
            type='submit'
            class='btn btn-primary btn-save float-end'
            disabled={!updateSupported}
            onClick={updateEntry}
          >
            Save
          </button>
        </div>
      </form>

      <DeleteEntryModal
        open={isDeleteEntryModalOpen}
        entry={internalEntry}
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
