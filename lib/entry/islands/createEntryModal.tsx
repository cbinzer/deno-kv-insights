import { FunctionComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { createEntry } from '../services/entryClientService.ts';
import { Entry, EntryValue, KeyPart, ValueType } from '../models.ts';
import ValueTypeDropdown from './valueTypeDropdown.tsx';
import EntryValueFormControl from './entryValueFormControl.tsx';
import Modal from '../../common/islands/modal.tsx';
import KeyFormControl from './keyFormControl.tsx';

const CreateEntryModal: FunctionComponent<
  { open: boolean; onClose?: () => void; onCreate?: (entry: Entry) => void }
> = (
  { open = false, onClose = () => {}, onCreate = () => {} },
) => {
  const [isOpen, setIsOpen] = useState(open);
  const [isCreating, setIsCreating] = useState(false);
  const [key, setKey] = useState<KeyPart[]>([]);
  const [keyAlreadyExists, setKeyAlreadyExists] = useState(false);
  const [valueType, setValueType] = useState(ValueType.STRING);
  const [value, setValue] = useState<EntryValue>('');
  const [createdEntry, setCreatedEntry] = useState<Entry | undefined>(undefined);

  const keyInputRef = useRef<HTMLInputElement>();

  useEffect(() => setIsOpen(open), [open]);

  const setEntryKey = (newKey: KeyPart[]) => {
    setKeyAlreadyExists(false);
    setKey(newKey);
  };

  const changeValueType = (valueType: ValueType) => {
    setValueType(valueType);

    switch (valueType) {
      case ValueType.BOOLEAN:
        setValue(true);
        break;
      case ValueType.OBJECT:
        setValue({});
        break;
      case ValueType.NUMBER:
        setValue(0);
        break;
      case ValueType.STRING:
        setValue('');
        break;
      case ValueType.NULL:
        setValue(null);
        break;
      case ValueType.UNDEFINED:
        setValue(undefined);
        break;
      case ValueType.DATE:
        setValue(new Date());
        break;
      case ValueType.BIGINT:
        setValue(BigInt(0));
        break;
      case ValueType.UINT8ARRAY:
        setValue(new Uint8Array());
        break;
      case ValueType.REGEXP:
        setValue(new RegExp('.*', 'g'));
        break;
      case ValueType.SET:
        setValue(new Set());
        break;
      case ValueType.MAP:
        setValue(new Map());
        break;
    }
  };

  const createNewEntry = async (event: Event) => {
    event.preventDefault();

    if (key.length === 0) {
      return;
    }

    try {
      setIsCreating(true);
      const createdEntry = await createEntry({ key, value });

      setCreatedEntry(createdEntry);
      setIsOpen(false);
    } catch (e) {
      console.log(e);
      setKeyAlreadyExists(true);
    } finally {
      setIsCreating(false);
    }
  };

  const closeModal = () => {
    setKeyAlreadyExists(false);
    setKey([]);
    changeValueType(ValueType.STRING);

    if (createdEntry) {
      onCreate(createdEntry);
      setCreatedEntry(undefined);
    }

    onClose();
  };

  return (
    <Modal open={isOpen} onOpen={() => keyInputRef.current.focus()} onClose={closeModal}>
      <div class='modal-header'>
        <h1 class='modal-title fs-5'>New entry</h1>
        <button class='btn-close' onClick={closeModal} disabled={isCreating}></button>
      </div>

      <div class='modal-body'>
        <form>
          <div class='mb-3'>
            <label for='key' class='col-form-label'>Key:</label>
            <KeyFormControl
              id='key'
              value={key}
              keyAlreadyExists={keyAlreadyExists}
              inputRef={keyInputRef}
              onChange={setEntryKey}
            />
          </div>
          <div class='mb-3'>
            <label for='type' class='col-form-label'>Type:</label>
            <div id='type'>
              <ValueTypeDropdown valueType={valueType} onSelect={changeValueType} />
            </div>
          </div>
          <div class='mb-3'>
            {valueType !== ValueType.NULL && valueType !== ValueType.UNDEFINED
              ? (
                <>
                  <label for='entryValue' class='col-form-label'>Value:</label>
                  <EntryValueFormControl id='entryValue' valueType={valueType} value={value} onChange={setValue} />
                </>
              )
              : null}
          </div>
        </form>
      </div>

      <div class='modal-footer'>
        <button class='btn btn-secondary' onClick={closeModal} disabled={isCreating}>Cancel</button>
        <button class='btn btn-primary' onClick={createNewEntry} disabled={key.length === 0 || isCreating}>
          {isCreating ? <span class='spinner-border spinner-border-sm' /> : 'Create'}
        </button>
      </div>
    </Modal>
  );
};

export default CreateEntryModal;
