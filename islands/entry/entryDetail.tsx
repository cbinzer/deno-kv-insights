import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { getEntryByCursor, updateEntry } from '../../lib/entry/entryClientService.ts';
import { Entry, EntryValue, ValueType } from '../../lib/entry/models.ts';
import { convertKeyToString, getValueTypeColorClass } from '../../lib/entry/utils.ts';
import DeleteEntryModal from './deleteEntryModal.tsx';
import EntryValueFormControl from '../common/form-control/entryValueFormControl.tsx';
import EntryDetailLoadingPlaceholder from '../../components/entryDetailLoadingPlaceholder.tsx';
import TrashIcon from '../../components/common/icon/trashIcon.tsx';

const EntryDetail: FunctionComponent<EntryDetailProps> = ({ cursor, keyPrefix, onDelete = () => {} }) => {
  const [entry, setEntry] = useState<Entry | undefined>(cursor);
  const [isDeleteEntryModalOpen, setIsDeleteEntryModalOpen] = useState(false);
  const [isValueInvalid, setIsValueInvalid] = useState(false);
  const [isLoadingEntry, setIsLoadingEntry] = useState(false);
  const [isUpdatingEntry, setIsUpdatingEntry] = useState(false);

  useEffect(() => {
    if (cursor) {
      setIsLoadingEntry(true);
      getEntryByCursor(cursor, keyPrefix).then((entry) => {
        setEntry(entry);
        setIsLoadingEntry(false);
      });
    }
  }, [cursor]);

  if (isLoadingEntry) {
    return <EntryDetailLoadingPlaceholder />;
  }

  if (!cursor || !entry) {
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
    setIsUpdatingEntry(true);

    const updatedEntry = await updateEntry(entry, keyPrefix);
    setEntry(updatedEntry);

    setIsUpdatingEntry(false);
  };

  const setValue = (value: EntryValue) => {
    setEntry((previousEntry) => ({ ...previousEntry as Entry, value: value }));
    setIsValueInvalid(false);
  };

  return (
    <div class='entry-detail'>
      <div class='header'>
        <p class='h5'>
          <span class={`badge ${getValueTypeColorClass(entry.valueType)}`}>{entry.valueType}</span>{' '}
          {convertKeyToString(entry.key)}
        </p>
        <button class='btn' onClick={() => setIsDeleteEntryModalOpen(true)} disabled={isUpdatingEntry}>
          <TrashIcon />
        </button>
      </div>

      <form class='form' onSubmit={saveEntry}>
        <div class='mb-3'>
          <label for='cursor' class='form-label'>Cursor</label>
          <input type='text' class='form-control' id='cursor' disabled={true} value={entry.cursor} />
        </div>
        <div class='mb-3'>
          <label for='version' class='form-label'>Version</label>
          <input type='text' class='form-control' id='version' disabled={true} value={entry.version} />
        </div>
        <div class='mb-3'>
          {entry?.valueType !== ValueType.NULL && entry?.valueType !== ValueType.UNDEFINED
            ? (
              <>
                <label for='entryValueForUpdate' class='form-label'>Value</label>
                <EntryValueFormControl
                  id='entryValueForUpdate'
                  valueType={entry.valueType}
                  value={entry.value}
                  disabled={isUpdatingEntry}
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
            disabled={isValueInvalid || isUpdatingEntry}
            onClick={changeEntry}
          >
            {isUpdatingEntry
              ? (
                <>
                  <span class='spinner-border spinner-border-sm' />
                </>
              )
              : 'Save'}
          </button>
        </div>
      </form>

      <DeleteEntryModal
        open={isDeleteEntryModalOpen}
        entry={entry}
        keyPrefix={keyPrefix}
        onDelete={deleteEntry}
        onClose={() => setIsDeleteEntryModalOpen(false)}
      />
    </div>
  );
};

export interface EntryDetailProps {
  cursor: string | undefined;
  keyPrefix?: string;
  onDelete?: () => void;
}

export default EntryDetail;
