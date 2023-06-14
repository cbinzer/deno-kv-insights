import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { KvEntry, KvKeyPart } from '../lib/kv/models.ts';
import { createEntry } from '../lib/kv/kvEntryClientService.ts';

const CreateEntryModal: FunctionComponent<
  { open: boolean; onClose?: () => void; onCreate?: (entry: KvEntry) => void }
> = (
  { open = false, onClose = () => {}, onCreate = () => {} },
) => {
  const [entry, setEntry] = useState<{ key: KvKeyPart[]; value: unknown }>({ key: [], value: undefined });
  const [isOpen, setIsOpen] = useState(false);

  const setKey = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    let newKey: KvKeyPart[] = [];
    if (inputElement.value) {
      newKey = inputElement.value.split(' ');
    }

    setEntry((previousEntry) => {
      return {
        ...previousEntry,
        key: newKey,
      };
    });
  };

  const setValue = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    setEntry((previousEntry) => {
      return {
        ...previousEntry,
        value: inputElement.value,
      };
    });
  };

  const createNewEntry = async () => {
    const createdEntry = await createEntry(entry.key, entry.value);
    onCreate(createdEntry);
    closeModal();
  };

  const closeModal = () => {
    setIsOpen(false);
    onClose();
  };

  useEffect(() => setIsOpen(open), [open]);

  return (
    <div class={`create-entry-modal modal fade ${isOpen ? 'show' : ''}`} tabIndex={-1}>
      <div class='modal-dialog'>
        <div class='modal-content'>
          <div class='modal-header'>
            <h1 class='modal-title fs-5'>New entry</h1>
            <button class='btn-close' onClick={closeModal}></button>
          </div>
          <div class='modal-body'>
            <form>
              <div class='mb-3'>
                <label for='key' class='col-form-label'>Key:</label>
                <input type='text' class='form-control' id='key' onChange={setKey} />
              </div>
              <div class='mb-3'>
                <label for='value' class='col-form-label'>Value:</label>
                <textarea class='form-control value-form-control' id='value' onChange={setValue}></textarea>
              </div>
            </form>
          </div>
          <div class='modal-footer'>
            <button class='btn btn-secondary' onClick={closeModal}>Close</button>
            <button class='btn btn-primary' onClick={createNewEntry}>Create</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEntryModal;
