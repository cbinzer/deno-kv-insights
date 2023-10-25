import { FunctionComponent } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import SearchIcon from '../../common/components/icon/searchIcon.tsx';
import { HTTPStrippedEntries, StrippedEntry } from '../models.ts';
import { createEntriesExportLink } from '../services/entryExportClientService.ts';
import CreateEntryModal from './createEntryModal.tsx';
import DeleteEntriesModal from './deleteEntriesModal.tsx';
import EntriesList from './entriesList.tsx';
import ImportEntriesModal from './importEntriesModal.tsx';

const EntriesManagement: FunctionComponent<EntriesManagementProps> = ({ initialEntries }) => {
  const [keyPrefix, setKeyPrefix] = useState<string>('');
  const [selectedEntryCursor, setSelectedEntryCursor] = useState<string | undefined>(undefined);
  const [selectedEntries, setSelectedEntries] = useState<StrippedEntry[]>([]);
  const [isCreateEntryModalOpen, setIsCreateEntryModalOpen] = useState(false);
  const [doReloadEntries, setDoReloadEntries] = useState<boolean>(false);
  const [actionsEnabled, setActionsEnabled] = useState<boolean>(false);
  const [isDeleteEntriesModalOpen, setIsDeleteEntriesModalOpen] = useState(false);
  const [isActionsMenuVisible, setIsActionsMenuVisible] = useState<boolean>(false);
  const [entriesExportLink, setEntriesExportLink] = useState<string>('#');
  const [entriesImportFile, setEntriesImportFile] = useState<File | undefined>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const actionsMenuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (isActionsMenuVisible) {
      document.addEventListener('mousedown', closeMenuOnOutsideClick);
    } else {
      document.removeEventListener('mousedown', closeMenuOnOutsideClick);
    }
  }, [isActionsMenuVisible]);

  const closeMenuOnOutsideClick = useMemo(() => (event: Event) => {
    const clickedElement = event.target as Node;
    if (actionsMenuRef.current && !actionsMenuRef.current.contains(clickedElement)) {
      setIsActionsMenuVisible(false);
    }
  }, undefined);

  const openCreateEntryModal = () => {
    setIsCreateEntryModalOpen(true);
    setDoReloadEntries(false);
  };

  const changePrefix = (event: Event) => {
    const input = event.target as HTMLInputElement;
    setKeyPrefix(input.value);
    setSelectedEntryCursor(undefined);
  };

  const changeSelectedEntryCursor = (cursor: string) => {
    setDoReloadEntries(false);
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

    setDoReloadEntries(false);
    setIsDeleteEntriesModalOpen(true);
    setIsActionsMenuVisible(false);
  };

  const closeDeleteEntriesModal = () => {
    if (selectedEntries.some((entry) => entry.cursor === selectedEntryCursor)) {
      setSelectedEntryCursor(undefined);
    }

    setDoReloadEntries(true);
    toggleActionsEnabled([]);
  };

  const openFilePicker = (event: Event) => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
      event.preventDefault();
      setIsActionsMenuVisible(false);
    }
  };

  const openEntriesImportModal = (event: Event) => {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput && fileInput.files) {
      setEntriesImportFile(fileInput.files[0]);
      setDoReloadEntries(false);
    }
  };

  const closeEntriesImportModal = (reloadEntries = false) => {
    if (fileInputRef.current) {
      setEntriesImportFile(undefined);
      fileInputRef.current.value = '';
      setDoReloadEntries(reloadEntries);
    }
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
                <input
                  class='d-none'
                  type='file'
                  accept='.jsonl'
                  ref={fileInputRef}
                  onChange={openEntriesImportModal}
                />
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
                  <li>
                    <a
                      class={`dropdown-item`}
                      href='#'
                      onClick={openFilePicker}
                    >
                      Import entries
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
                doReload={doReloadEntries}
              />
            </div>
          </div>
        </div>
      </div>

      <CreateEntryModal
        open={isCreateEntryModalOpen}
        onClose={() => setIsCreateEntryModalOpen(false)}
        onCreate={() => setDoReloadEntries(true)}
      />

      <DeleteEntriesModal
        open={isDeleteEntriesModalOpen}
        entries={selectedEntries}
        onDelete={closeDeleteEntriesModal}
        onClose={() => setIsDeleteEntriesModalOpen(false)}
      />

      <ImportEntriesModal
        open={!!entriesImportFile}
        entriesImportFile={entriesImportFile}
        onImport={() => closeEntriesImportModal(true)}
        onClose={() => closeEntriesImportModal(false)}
      />
    </>
  );
};

export interface EntriesManagementProps {
  initialEntries: HTTPStrippedEntries;
}

export default EntriesManagement;
