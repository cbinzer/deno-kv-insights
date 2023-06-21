import { FunctionComponent, Ref } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { KeyPart } from '../../lib/entry/models.ts';
import { convertReadableStringToKey } from '../../lib/entry/utils.ts';

const KeyFormControl: FunctionComponent<KeyFormControlProps> = (
  { id, value = [], keyAlreadyExists = false, inputRef, onChange = () => {}, onInvalid = () => {} },
) => {
  const [isKeyInvalid, setIsKeyInvalid] = useState(false);
  const [internalKey, setInternalKey] = useState<KeyPart[]>(value);

  useEffect(() => {
    setInternalKey(value);
  }, [value]);

  const convertKeyToReadableString = (key: KeyPart[]): string => {
    return `${
      key.map((keyPart) => {
        switch (typeof keyPart) {
          case 'number':
          case 'bigint':
          case 'boolean':
            return keyPart.toString();
          case 'object':
            return `[${(keyPart as Uint8Array).join(',')}]`;
          default:
            const isNumber = !isNaN(Number(keyPart)) || (keyPart.startsWith('"') && keyPart.endsWith('"'));
            const isBoolean = keyPart === 'true' || keyPart === 'false';

            if (isNumber || isBoolean) {
              return `"${keyPart}"`;
            }

            return keyPart;
        }
      }).join(' ')
    }`;
  };

  const validateAndChangeKey = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const key = convertReadableStringToKey(input.value);

    if (key.length === 0) {
      setIsKeyInvalid(true);
      onInvalid();
    } else {
      setIsKeyInvalid(false);
    }

    setInternalKey(key);
    onChange(key);
  };

  return (
    <>
      <input
        type='text'
        class={`form-control ${isKeyInvalid || keyAlreadyExists ? 'is-invalid' : ''}`}
        id={id}
        value={convertKeyToReadableString(internalKey)}
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
  value: KeyPart[];
  keyAlreadyExists?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  onChange?: (key: KeyPart[]) => void;
  onInvalid?: () => void;
}

export default KeyFormControl;
