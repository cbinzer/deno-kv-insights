import { FunctionComponent } from 'preact';
import { StrippedEntry } from '../models.ts';
import Modal from '../../common/islands/modal.tsx';

const DeleteEntriesModal: FunctionComponent<DeleteEntriesModalProps> = (
  { open = false, entries = [], onClose = () => {}, onDelete = () => {} },
) => {
  const deleteEntries = async () => {
    onClose();
    setTimeout(() => onDelete(), 150);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div class='modal-header'>
        <h1 class='modal-title fs-5'>Delete entries</h1>
        <button class='btn-close' onClick={onClose}></button>
      </div>

      <div class='modal-body'>
        <p>Do you wanna really delete {entries.length} {entries.length === 1 ? 'entry' : 'entries'}?</p>
      </div>

      <div class='modal-footer'>
        <button class='btn btn-secondary' onClick={onClose}>Cancel</button>
        <button class='btn btn-danger' onClick={deleteEntries}>Delete</button>
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
