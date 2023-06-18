import { asset } from '$fresh/runtime.ts';
import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { updateEntry } from '../lib/entry/entryClientService.ts';
import { Entry, EntryValue, ValueType } from '../lib/entry/models.ts';
import { getValueTypeColorClass } from '../lib/entry/utils.ts';
import DeleteEntryModal from './deleteEntryModal.tsx';
import EntryValueFormControl from './entryValueFormControl.tsx';

const EntryDetail: FunctionComponent<EntryDetailProps> = ({ entry, onDelete = () => {} }) => {
  const [internalEntry, setInternalEntry] = useState<Entry | undefined>(entry);
  const [isDeleteEntryModalOpen, setIsDeleteEntryModalOpen] = useState(false);
  const [isValueInvalid, setIsValueInvalid] = useState(false);

  useEffect(() => setInternalEntry(entry), [entry]);

  if (!entry || !internalEntry) {
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

  const changeEntry = async () => {
    const updatedEntry = await updateEntry(internalEntry);
    setInternalEntry(updatedEntry);
  };

  const setValue = (value: EntryValue) => {
    setInternalEntry((previousEntry) => ({ ...previousEntry as Entry, value: value }));
    setIsValueInvalid(false);
  };

  return (
    <div class='entry-detail'>
      <div class='header'>
        <p class='h5'>
          <span class={`badge ${getValueTypeColorClass(internalEntry.valueType)}`}>{internalEntry.valueType}</span>{' '}
          [{internalEntry.key.join(', ')}]
        </p>
        <button class='btn' onClick={() => setIsDeleteEntryModalOpen(true)}>
          <img src={asset('icons/trash3.svg')} alt="trash icon" />
        </button>
      </div>

      <form class='form' onSubmit={saveEntry}>
        <div class='mb-3'>
          <label for='cursor' class='form-label'>Cursor</label>
          <input type='text' class='form-control' id='cursor' disabled={true} value={internalEntry.cursor} />
        </div>
        <div class='mb-3'>
          <label for='version' class='form-label'>Version</label>
          <input type='text' class='form-control' id='version' disabled={true} value={internalEntry.version} />
        </div>
        <div class='mb-3'>
          {entry?.valueType !== ValueType.NULL && entry?.valueType !== ValueType.UNDEFINED
            ? (
              <>
                <label for='entryValueForUpdate' class='form-label'>Value</label>
                <EntryValueFormControl
                  id='entryValueForUpdate'
                  valueType={internalEntry.valueType}
                  value={internalEntry.value}
                  onChange={setValue}
                  onInvalid={() => setIsValueInvalid(true)}
                />
              </>
            )
            : null}
        </div>
        <div>
          <button
            type='submit'
            class='btn btn-primary btn-save float-end'
            disabled={isValueInvalid}
            onClick={changeEntry}
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
  entry: Entry | undefined;
  onDelete?: () => void;
}

export default EntryDetail;
