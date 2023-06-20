import { FunctionComponent, Ref } from 'preact';
import { useEffect, useState } from 'preact/hooks';

const KeyFormControl: FunctionComponent<KeyFormControlProps> = (
  { id, value = '', keyAlreadyExists = false, inputRef, onChange = () => {}, onInvalid = () => {} },
) => {
  const [isKeyInvalid, setIsKeyInvalid] = useState(false);
  const [key, setKey] = useState(value);

  useEffect(() => setKey(value), [value]);

  const validateAndChangeKey = (event: Event) => {
    const input = event.target as HTMLInputElement;
    setKey(input.value);

    if (!input.value) {
      setIsKeyInvalid(true);
      onInvalid();
    } else {
      setIsKeyInvalid(false);
    }

    onChange(input.value);
  };

  return (
    <>
      <input
        type='text'
        class={`form-control ${isKeyInvalid || keyAlreadyExists ? 'is-invalid' : ''}`}
        id={id}
        value={key}
        ref={inputRef}
        onChange={validateAndChangeKey}
      />
      <div class='invalid-feedback'>
        {isKeyInvalid ? 'Please provide a valid key.' : ''}
        {keyAlreadyExists ? 'Entry with this key already exists.' : ''}
      </div>
    </>
  );
};

export interface KeyFormControlProps {
  id?: string;
  value: string;
  keyAlreadyExists?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  onChange?: (key: string) => void;
  onInvalid?: () => void;
}

export default KeyFormControl;
