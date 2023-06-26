import { FunctionComponent } from 'preact';
import { deleteEntryByCursor } from '../../lib/entry/entryClientService.ts';
import { Entry } from '../../lib/entry/models.ts';
import Modal from '../common/modal.tsx';
import { convertKeyToString } from '../../lib/entry/utils.ts';

const DeleteEntryModal: FunctionComponent<DeleteEntryModalProps> = (
  { open = false, entry, keyPrefix, onClose = () => {}, onDelete = () => {} },
) => {
  const deleteEntry = async () => {
    console.log(keyPrefix);
    await deleteEntryByCursor(entry?.cursor as string, keyPrefix);
    onClose();
    setTimeout(() => onDelete(), 150);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div class='modal-header'>
        <h1 class='modal-title fs-5'>Delete entry</h1>
        <button class='btn-close' onClick={onClose}></button>
      </div>

      <div class='modal-body'>
        <p>Do you wanna really delete the entry with key [{convertKeyToString(entry.key)}]?</p>
      </div>

      <div class='modal-footer'>
        <button class='btn btn-secondary' onClick={onClose}>Cancel</button>
        <button class='btn btn-danger' onClick={deleteEntry}>Delete</button>
      </div>
    </Modal>
  );
};

export interface DeleteEntryModalProps {
  open: boolean;
  entry: Entry | undefined;
  keyPrefix?: string;
  onClose?: () => void;
  onDelete?: () => void;
}

export default DeleteEntryModal;
