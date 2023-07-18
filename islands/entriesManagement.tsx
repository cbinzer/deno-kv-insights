import { FunctionComponent } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { HTTPStrippedEntries, StrippedEntry } from '../lib/entry/models.ts';
import EntriesList from './entriesList.tsx';
import EntryDetail from './entryDetail.tsx';
import CreateEntryModal from './createEntryModal.tsx';
import SearchIcon from '../lib/common/components/icon/searchIcon.tsx';
import DeleteEntriesModal from './deleteEntriesModal.tsx';
import { createEntriesExportLink } from '../lib/entry/services/entryExportClientService.ts';

const EntriesManagement: FunctionComponent<EntriesManagementProps> = ({ initialEntries }) => {
  const [keyPrefix, setKeyPrefix] = useState<string>('');
  const [selectedEntryCursor, setSelectedEntryCursor] = useState<string | undefined>(undefined);
  const [selectedEntries, setSelectedEntries] = useState<StrippedEntry[]>([]);
  const [isCreateEntryModalOpen, setIsCreateEntryModalOpen] = useState(false);
  const [doReload, setDoReload] = useState<boolean>(false);
  const [actionsEnabled, setActionsEnabled] = useState<boolean>(false);
  const [isDeleteEntriesModalOpen, setIsDeleteEntriesModalOpen] = useState(false);
  const [isActionsMenuVisible, setIsActionsMenuVisible] = useState<boolean>(false);
  const [entriesExportLink, setEntriesExportLink] = useState<string>('#');

  const actionsMenuRef = useRef();

  useEffect(() => {
    if (isActionsMenuVisible) {
      document.addEventListener('mousedown', closeMenuOnOutsideClick);
    } else {
      document.removeEventListener('mousedown', closeMenuOnOutsideClick);
    }
  }, [isActionsMenuVisible]);

  const closeMenuOnOutsideClick = useMemo(() => (event: Event) => {
    if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target)) {
      setIsActionsMenuVisible(false);
    }
  });

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

  const toggleActionsEnabled = (entries: StrippedEntry[]) => {
    setActionsEnabled(entries.length > 0);
    setSelectedEntries(entries);

    const keys = entries.map((entry) => entry.key);
    setEntriesExportLink(createEntriesExportLink(keys));
  };

  const openDeleteEntriesModal = (event: Event) => {
    event.preventDefault();

    setDoReload(false);
    setIsDeleteEntriesModalOpen(true);
    setIsActionsMenuVisible(false);
  };

  const closeDeleteEntriesModal = () => {
    if (selectedEntries.some((entry) => entry.cursor === selectedEntryCursor)) {
      setSelectedEntryCursor(undefined);
    }

    setDoReload(true);
    toggleActionsEnabled([]);
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

              <div class='btn-group'>
                <button class='btn btn-primary' onClick={openCreateEntryModal}>+ Entry</button>
                <button
                  type='button'
                  class='btn btn-outline-primary dropdown-toggle dropdown-toggle-split'
                  onClick={() => setIsActionsMenuVisible(!isActionsMenuVisible)}
                >
                  <span class='visually-hidden'>Toggle Dropdown</span>
                </button>
                <ul
                  class={`dropdown-menu ${isActionsMenuVisible ? 'show' : ''}`}
                  style={{ top: '40px', right: 0 }}
                  ref={actionsMenuRef}
                >
                  <li>
                    <a
                      class={`dropdown-item ${actionsEnabled ? '' : 'disabled'}`}
                      href='#'
                      onClick={openDeleteEntriesModal}
                    >
                      Delete selected
                    </a>
                  </li>
                  <li>
                    <a
                      class={`dropdown-item ${actionsEnabled ? '' : 'disabled'}`}
                      href={entriesExportLink}
                      onClick={() => setIsActionsMenuVisible(false)}
                    >
                      Export selected
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div class='entries-list-container'>
              <EntriesList
                initialEntries={initialEntries}
                keyPrefix={keyPrefix}
                selectedEntries={selectedEntries}
                onSelect={(entry) => changeSelectedEntryCursor(entry.cursor)}
                onSelectMany={toggleActionsEnabled}
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

      <DeleteEntriesModal
        open={isDeleteEntriesModalOpen}
        entries={selectedEntries}
        onDelete={closeDeleteEntriesModal}
        onClose={() => setIsDeleteEntriesModalOpen(false)}
      />
    </>
  );
};

export interface EntriesManagementProps {
  initialEntries: HTTPStrippedEntries;
}

export default EntriesManagement;
