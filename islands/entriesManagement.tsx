import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { getEntryByCursor } from '../lib/entry/entryClientService.ts';
import { Entry, HTTPStrippedEntries } from '../lib/entry/models.ts';
import EntriesList from './entriesList.tsx';
import EntryDetail from './entryDetail.tsx';
import CreateEntryModal from './createEntryModal.tsx';

const EntriesManagement: FunctionComponent<EntriesManagementProps> = ({ initialEntries }) => {
  const [selectedEntry, setSelectedEntry] = useState<Entry | undefined>(undefined);
  const [isCreateEntryModalOpen, setIsCreateEntryModalOpen] = useState(false);
  const [doReload, setDoReload] = useState<boolean>(false);

  const loadEntry = async (cursor: string) => {
    const entry = await getEntryByCursor(cursor);
    setDoReload(false);
    setSelectedEntry(entry);
  };

  const removeSelectedEntry = () => {
    setDoReload(true);
    setSelectedEntry(undefined);
  };

  const openCreateEntryModal = () => {
    setIsCreateEntryModalOpen(true);
    setDoReload(false);
  };

  return (
    <>
      <div class='entries-management'>
        <div class='panel'>
          <div class="left-panel-container">
            <div class='action-container'>
              <div></div>
              <button class='btn btn-primary' onClick={openCreateEntryModal}>+ Entry</button>
            </div>

            <EntriesList
              initialEntries={initialEntries}
              onSelect={(entry) => loadEntry(entry.cursor)}
              doReload={doReload}
            />
          </div>
        </div>
        <div class='panel'>
          <EntryDetail entry={selectedEntry} onDelete={removeSelectedEntry} />
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
