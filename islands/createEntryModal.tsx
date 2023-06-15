import { FunctionComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { KvEntry, KvKeyPart } from '../lib/kv/models.ts';
import { createEntry } from '../lib/kv/kvEntryClientService.ts';

const CreateEntryModal: FunctionComponent<
  { open: boolean; onClose?: () => void; onCreate?: (entry: KvEntry) => void }
> = (
  { open = false, onClose = () => {}, onCreate = () => {} },
) => {
  const [entry, setEntry] = useState<{ key: KvKeyPart[]; value: unknown }>({ key: [], value: undefined });
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isKeyInvalid, setIsKeyInvalid] = useState(false);
  const [invalidKeyFeedback, setInvalidKeyFeedback] = useState('');
  const valueFormControlRef = useRef<HTMLTextAreaElement | undefined>(undefined);

  const setKey = (event: Event) => {
    setIsKeyInvalid(false);

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
    if (!entry.key.length) {
      setIsKeyInvalid(true);
      setInvalidKeyFeedback('Please provide a valid key.')
      return;
    }

    try {
      const createdEntry = await createEntry(entry.key, entry.value);
      onCreate(createdEntry);
      closeModal();
    } catch (e) {
      setIsKeyInvalid(true);
      setInvalidKeyFeedback('Entry with this key already exist.')
    }
  };

  const closeModal = () => {
    setEntry({ key: [], value: undefined });
    setIsKeyInvalid(false);

    if (valueFormControlRef.current) {
      valueFormControlRef.current.value = '';
    }

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
      class={`create-entry-modal modal fade ${isVisible ? 'show' : ''}`}
      tabIndex={-1}
      style={{ display: isOpen ? 'block' : undefined }}
    >
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
                <input
                  type='text'
                  class={`form-control ${isKeyInvalid ? 'is-invalid' : ''}`}
                  id='key'
                  value={entry.key.join(', ')}
                  onChange={setKey}
                />
                <div class='invalid-feedback'>{invalidKeyFeedback}</div>
              </div>
              <div class='mb-3'>
                <label for='value' class='col-form-label'>Value:</label>
                <textarea
                  ref={valueFormControlRef}
                  class='form-control value-form-control'
                  id='value'
                  value={entry?.value as string}
                  onChange={setValue}
                />
              </div>
            </form>
          </div>
          <div class='modal-footer'>
            <button class='btn btn-secondary' onClick={closeModal}>Cancel</button>
            <button class='btn btn-primary' onClick={createNewEntry}>Create</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEntryModal;
