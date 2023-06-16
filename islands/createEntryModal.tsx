import { FunctionComponent } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { createEntry } from '../lib/entry/entryClientService.ts';
import { Entry, ValueType } from '../lib/entry/models.ts';
import ValueTypeDropdown from './valueTypeDropdown.tsx';
import BooleanValueFormControl from './booleanValueFormControl.tsx';

const CreateEntryModal: FunctionComponent<
  { open: boolean; onClose?: () => void; onCreate?: (entry: Entry) => void }
> = (
  { open = false, onClose = () => {}, onCreate = () => {} },
) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isKeyInvalid, setIsKeyInvalid] = useState(false);
  const [isValueInvalid, setIsValueInvalid] = useState(false);
  const [invalidKeyFeedback, setInvalidKeyFeedback] = useState('');
  const [key, setKey] = useState('');
  const [value, setValue] = useState<string | boolean>('');
  const [valueType, setValueType] = useState(ValueType.STRING);

  const valueFormControlRef = useRef<HTMLTextAreaElement | undefined>(undefined);

  const setEntryKey = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    setIsKeyInvalid(false);
    setKey(inputElement.value);
  };

  const setEntryValue = (event: Event) => {
    const inputElement = event.target as HTMLTextAreaElement;
    setIsValueInvalid(false);
    setValue(inputElement.value);
  };

  const convertValue = (value: string | boolean): Record<string, unknown> | string | boolean | undefined => {
    if (valueType === ValueType.OBJECT && typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return undefined;
      }
    }

    return value;
  };

  const changeValueType = (valueType: ValueType) => {
    setIsValueInvalid(false);
    setValueType(valueType);

    switch (valueType) {
      case ValueType.BOOLEAN:
        setValue(true);
        break;
      case ValueType.OBJECT:
        setValue('{}');
        break;
      default:
        setValue('');
    }
  };

  const createNewEntry = async () => {
    const newKey = key?.split(' ');
    if (!key || !newKey || newKey.length === 0) {
      setIsKeyInvalid(true);
      setInvalidKeyFeedback('Please provide a valid key.');
      return;
    }

    const newValue = convertValue(value);
    if (newValue === undefined) {
      setIsValueInvalid(true);
      return;
    }

    try {
      const createdEntry = await createEntry(newKey, newValue);
      onCreate(createdEntry);
      closeModal();
    } catch (e) {
      setIsKeyInvalid(true);
      setInvalidKeyFeedback('Entry with this key already exist.');
    }
  };

  const closeModal = () => {
    setIsKeyInvalid(false);
    setIsValueInvalid(false);

    setKey('');
    changeValueType(ValueType.STRING);

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
                  : (
                    <>
                      <label for='value' class='col-form-label'>Value:</label>
                      <textarea
                        ref={valueFormControlRef}
                        class={`form-control value-form-control ${isValueInvalid ? 'is-invalid' : ''}`}
                        id='value'
                        value={value as string}
                        onChange={setEntryValue}
                      />
                      <div class='invalid-feedback'>Could not parse object.</div>
                    </>
                  )}
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
