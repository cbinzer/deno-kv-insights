import { FunctionComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { createEntry } from '../lib/entry/entryClientService.ts';
import { Entry, ValueType } from '../lib/entry/models.ts';
import ValueTypeDropdown from './valueTypeDropdown.tsx';
import BooleanValueFormControl from './booleanValueFormControl.tsx';
import NumberValueFormControl from './numberValueFormControl.tsx';
import StringValueFormControl from './stringValueFormControl.tsx';
import ObjectValueFormControl from './objectValueFormControl.tsx';

const CreateEntryModal: FunctionComponent<
  { open: boolean; onClose?: () => void; onCreate?: (entry: Entry) => void }
> = (
  { open = false, onClose = () => {}, onCreate = () => {} },
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [key, setKey] = useState('');
  const [isKeyInvalid, setIsKeyInvalid] = useState(false);
  const [invalidKeyFeedback, setInvalidKeyFeedback] = useState('');
  const [valueType, setValueType] = useState(ValueType.STRING);
  const [value, setValue] = useState<string | boolean | number>('');

  const setEntryKey = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    setIsKeyInvalid(false);
    setKey(inputElement.value);
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
      default:
        setValue('');
    }
  };

  const createNewEntry = async () => {
    const newKey = key?.split(' ');
    console.log(newKey);
    if (!key || !newKey || newKey.length === 0) {
      setIsKeyInvalid(true);
      setInvalidKeyFeedback('Please provide a valid key.');
      return;
    }

    try {
      const createdEntry = await createEntry(newKey, value);
      onCreate(createdEntry);
      closeModal();
    } catch (e) {
      setIsKeyInvalid(true);
      setInvalidKeyFeedback('Entry with this key already exist.');
    }
  };

  const closeModal = () => {
    setIsKeyInvalid(false);
    setKey('');

    changeValueType(ValueType.STRING);

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
                  value={key}
                  onChange={setEntryKey}
                />
                <div class='invalid-feedback'>{invalidKeyFeedback}</div>
              </div>
              <div class='mb-3'>
                <label for='type' class='col-form-label'>Type:</label>
                <div id='type'>
                  <ValueTypeDropdown valueType={valueType} onSelect={changeValueType} />
                </div>
              </div>
              <div class='mb-3'>
                {valueType === ValueType.BOOLEAN
                  ? <BooleanValueFormControl value={value as boolean} onSelect={setValue} />
                  : null}
                {valueType === ValueType.NUMBER
                  ? <NumberValueFormControl value={value as number} onChange={setValue} />
                  : null}
                {valueType === ValueType.STRING
                  ? <StringValueFormControl value={value as string} onChange={setValue} />
                  : null}
                {valueType === ValueType.OBJECT
                  ? <ObjectValueFormControl value={value as Object} onChange={setValue} />
                  : null}
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
