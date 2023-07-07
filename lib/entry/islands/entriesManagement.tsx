import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { HTTPStrippedEntries } from '../models.ts';
import EntriesList from './entriesList.tsx';
import EntryDetail from './entryDetail.tsx';
import CreateEntryModal from './createEntryModal.tsx';
import SearchIcon from '../../common/components/icon/searchIcon.tsx';

const EntriesManagement: FunctionComponent<EntriesManagementProps> = ({ initialEntries }) => {
  const [keyPrefix, setKeyPrefix] = useState<string>('');
  const [selectedEntryCursor, setSelectedEntryCursor] = useState<string | undefined>(undefined);
  const [isCreateEntryModalOpen, setIsCreateEntryModalOpen] = useState(false);
  const [doReload, setDoReload] = useState<boolean>(false);

  const removeSelectedEntry = () => {
    setDoReload(true);
    setSelectedEntryCursor(undefined);
  };

  const openCreateEntryModal = () => {
    setIsCreateEntryModalOpen(true);
    setDoReload(false);
  };

  const changePrefix = (event: KeyboardEvent) => {
    const input = event.target as HTMLInputElement;
    setKeyPrefix(input.value);
    setSelectedEntryCursor(undefined);
  };

  const changeSelectedEntryCursor = (cursor: string) => {
    setDoReload(false);
    setSelectedEntryCursor(cursor);
  };

  return (
    <>
      <div class='entries-management'>
        <div class='panel'>
          <div class='left-panel-container'>
            <div class='action-container'>
              <div class='input-group search-form-control'>
                <span class='input-group-text'>
                  <SearchIcon />
                </span>
                <input
                  type='search'
                  class='form-control'
                  placeholder='Filter by key (eg. users alice)'
                  onSearch={changePrefix}
                />
              </div>

              <button class='btn btn-primary' onClick={openCreateEntryModal}>+ Entry</button>
            </div>

            <div class="entries-list-container">
              <EntriesList
                initialEntries={initialEntries}
                keyPrefix={keyPrefix}
                onSelect={(entry) => changeSelectedEntryCursor(entry.cursor)}
                doReload={doReload}
              />
            </div>
          </div>
        </div>
        <div class='panel'>
          <EntryDetail cursor={selectedEntryCursor} onDelete={removeSelectedEntry} />
        </div>
      </div>

      <CreateEntryModal
        open={isCreateEntryModalOpen}
        onClose={() => setIsCreateEntryModalOpen(false)}
        onCreate={() => setDoReload(true)}
      />
    </>
  );
};

export interface EntriesManagementProps {
  initialEntries: HTTPStrippedEntries;
}

export default EntriesManagement;
