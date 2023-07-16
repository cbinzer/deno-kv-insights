import { FunctionComponent } from 'preact';
import { StrippedEntry } from '../models.ts';
import Modal from '../../common/islands/modal.tsx';
import { deleteEntriesByKeys } from '../services/entryClientService.ts';
import { useState } from 'preact/hooks';

const DeleteEntriesModal: FunctionComponent<DeleteEntriesModalProps> = (
  { open = false, entries = [], onClose = () => {}, onDelete = () => {} },
) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteEntries = async () => {
    setIsDeleting(true);
    await deleteEntriesByKeys(entries.map((entry) => entry.key));
    setIsDeleting(false);

    onClose();
    setTimeout(() => onDelete(), 150);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div class='modal-header'>
        <h1 class='modal-title fs-5'>Delete entries</h1>
        <button class='btn-close' onClick={onClose} disabled={isDeleting}></button>
      </div>

      <div class='modal-body'>
        <p>Do you wanna really delete {entries.length} {entries.length === 1 ? 'entry' : 'entries'}?</p>
      </div>

      <div class='modal-footer'>
        <button class='btn btn-secondary' onClick={onClose} disabled={isDeleting}>Cancel</button>
        <button class='btn btn-danger' onClick={deleteEntries} disabled={isDeleting}>
          {isDeleting ? <span class='spinner-border spinner-border-sm' /> : 'Delete'}
        </button>
      </div>
    </Modal>
  );
};

export interface DeleteEntriesModalProps {
  open: boolean;
  entries: StrippedEntry[];
  onClose?: () => void;
  onDelete?: () => void;
}

export default DeleteEntriesModal;
