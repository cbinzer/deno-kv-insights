import { FunctionComponent } from 'preact';
import Modal from '../../common/islands/modal.tsx';
import { useEffect, useState } from 'preact/hooks';
import { importEntries } from '../services/entryImportClientService.ts';

const ImportEntriesModal: FunctionComponent<EntriesImportModalProps> = (
  { open = false, entriesImportFile, onClose = () => {}, onImport = () => {} },
) => {
  const [isOpen, setIsOpen] = useState(open);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => setIsOpen(open), [open]);

  const startEntriesImport = async () => {
    setIsImporting(true);
    await importEntries(entriesImportFile);
    setIsImporting(false);

    onImport();
  };

  const closeModal = () => {
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={closeModal}>
      <div class='modal-header'>
        <h1 class='modal-title fs-5'>Import entries</h1>
        <button class='btn-close' onClick={closeModal} disabled={isImporting}></button>
      </div>

      <div class='modal-body'>
        <p>{isImporting ? 'Importing...' : entriesImportFile?.name}</p>
      </div>

      <div class='modal-footer'>
        <button class='btn btn-secondary' onClick={closeModal} disabled={isImporting}>Cancel</button>
        <button class='btn btn-primary' onClick={startEntriesImport} disabled={isImporting}>
          {isImporting ? <span class='spinner-border spinner-border-sm' /> : 'Import'}
        </button>
      </div>
    </Modal>
  );
};

export interface EntriesImportModalProps {
  open: boolean;
  entriesImportFile?: File;
  onClose?: () => void;
  onImport?: () => void;
}

export default ImportEntriesModal;
