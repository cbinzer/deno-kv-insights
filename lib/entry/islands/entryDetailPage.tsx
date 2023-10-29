import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import ArrowLeftIcon from '../../common/components/icon/arrowLeftIcon.tsx';
import TrashIcon from '../../common/components/icon/trashIcon.tsx';
import { Entry, EntryValue } from '../models.ts';
import { updateEntry } from '../services/entryClientService.ts';
import { getValueType } from '../utils.ts';
import DeleteEntryModal from './deleteEntryModal.tsx';
import EntryValueFormControl from './entryValueFormControl.tsx';
import KeyFormControl from './keyFormControl.tsx';
import ValueTypeDropdown from './valueTypeDropdown.tsx';

const EntryDetailPage: FunctionComponent<EntryDetailPageProps> = ({ initialEntry }) => {
  const [entry, setEntry] = useState<Entry>(initialEntry);
  const [isDeleteEntryModalOpen, setIsDeleteEntryModalOpen] = useState(false);
  const [isValueInvalid, setIsValueInvalid] = useState(false);
  const [isUpdatingEntry, setIsUpdatingEntry] = useState(false);

  const deleteEntry = () => {
    setIsDeleteEntryModalOpen(false);
    window.location.href = '/kv-insights/entries';
  };

  const changeEntry = async () => {
    setIsUpdatingEntry(true);

    const updatedEntry = await updateEntry(entry);
    setEntry(updatedEntry);

    setIsUpdatingEntry(false);
  };

  const setValue = (value: EntryValue) => {
    setEntry((previousEntry) => ({ ...previousEntry as Entry, value: value }));
    setIsValueInvalid(false);
  };

  const valueType = getValueType(entry?.value);

  return (
    <div class='entry-detail'>
      <div class='action-container'>
        <div>
          <a class='btn back-btn' href='/kv-insights/entries'>
            <ArrowLeftIcon width={24} height={24} />
          </a>
        </div>

        <div class='btn-container'>
          <button
            form='entry-update-form'
            type='submit'
            class='btn btn-primary btn-save'
            disabled={isValueInvalid || isUpdatingEntry}
            onClick={changeEntry}
          >
            {isUpdatingEntry ? <span class='spinner-border spinner-border-sm' /> : 'Save'}
          </button>
          <button
            class='btn btn-danger'
            onClick={() => setIsDeleteEntryModalOpen(true)}
            disabled={isUpdatingEntry}
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <div class='detail-container'>
        <form id='entry-update-form' class='form' onSubmit={(event) => event.preventDefault()}>
          <div class='mb-3'>
            <label for='cursor' class='form-label'>Cursor</label>
            <input type='text' class='form-control' id='cursor' disabled={true} value={entry.cursor} />
          </div>
          <div class='mb-3'>
            <label for='version' class='form-label'>Version</label>
            <input type='text' class='form-control' id='version' disabled={true} value={entry.version} />
          </div>
          <div class='mb-3'>
            <label for='key' class='col-form-label'>Key:</label>
            <KeyFormControl
              id='key'
              value={entry.key}
              disabled={true}
            />
          </div>
          <div class='mb-3'>
            <label for='type' class='col-form-label'>Type:</label>
            <div id='type'>
              <ValueTypeDropdown valueType={valueType} disabled={true} />
            </div>
          </div>
          <div class='mb-3'>
            {entry?.value !== null && entry?.value !== undefined
              ? (
                <>
                  <label for='entryValueForUpdate' class='form-label'>Value</label>
                  <EntryValueFormControl
                    id='entryValueForUpdate'
                    valueType={valueType}
                    value={entry.value}
                    disabled={isUpdatingEntry}
                    onChange={setValue}
                    onInvalid={() => setIsValueInvalid(true)}
                  />
                </>
              )
              : null}
          </div>
        </form>

        <DeleteEntryModal
          open={isDeleteEntryModalOpen}
          entry={entry}
          onDelete={deleteEntry}
          onClose={() => setIsDeleteEntryModalOpen(false)}
        />
      </div>
    </div>
  );
};

export interface EntryDetailPageProps {
  initialEntry: Entry;
}

export default EntryDetailPage;
