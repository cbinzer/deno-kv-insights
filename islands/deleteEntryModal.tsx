import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { KvEntry } from '../lib/kv/models.ts';

const DeleteEntryModal: FunctionComponent<DeleteEntryModalProps> = (
  { open = false, entry, onClose = () => {}, onDelete = () => {} },
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const deleteEntry = async () => {
    onDelete();
    closeModal();
  };

  const closeModal = () => {
    setIsOpen(false);
    onClose();
  };

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    setIsVisible(open);
  }, [isOpen]);

  return (
    <div
      class={`delete-entry-modal modal fade ${isVisible ? 'show' : ''}`}
      tabIndex={-1}
      style={{ display: isOpen ? 'block' : undefined }}
    >
      <div class='modal-dialog'>
        <div class='modal-content'>
          <div class='modal-header'>
            <h1 class='modal-title fs-5'>Delete entry</h1>
            <button class='btn-close' onClick={closeModal}></button>
          </div>
          <div class='modal-body'>
            <p>Do you wanna really delete the entry with key [{entry?.key.join(', ')}]?</p>
          </div>
          <div class='modal-footer'>
            <button class='btn btn-secondary' onClick={closeModal}>Cancel</button>
            <button class='btn btn-danger' onClick={deleteEntry}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface DeleteEntryModalProps {
  open: boolean;
  entry: KvEntry | undefined;
  onClose?: () => void;
  onDelete?: () => void;
}

export default DeleteEntryModal;
