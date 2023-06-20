import { FunctionComponent, Ref } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { KeyPart } from '../../lib/entry/models.ts';

const KeyFormControl: FunctionComponent<KeyFormControlProps> = (
  { id, value = [], keyAlreadyExists = false, inputRef, onChange = () => {}, onInvalid = () => {} },
) => {
  const [isKeyInvalid, setIsKeyInvalid] = useState(false);
  const [internalKey, setInternalKey] = useState<KeyPart[]>(value);

  useEffect(() => {
    setInternalKey(value);
  }, [value]);

  const convertToKey = (stringKey: string): KeyPart[] => {
    return stringKey.split(' ').map((keyPart) => {
      const numberKeyPart = Number(keyPart);
      if (!isNaN(numberKeyPart)) {
        return numberKeyPart;
      }

      if (keyPart === 'true' || keyPart === 'false') {
        return keyPart === 'true';
      }

      if (keyPart.startsWith('[') && keyPart.endsWith(']') && keyPart.length > 2) {
        const numberArray: number[] = keyPart.substring(1, keyPart.length - 1).split(',').map((val) => Number(val));
        return new Int8Array(numberArray);
      }

      if (keyPart.startsWith('"') && keyPart.endsWith('"') && keyPart.length > 2) {
        return keyPart.substring(1, keyPart.length - 1);
      }

      return keyPart;
    });
  };

  const convertKeyToString = (key: KeyPart[]): string => {
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
            if (!isNaN(Number(keyPart)) || (keyPart.startsWith('"') && keyPart.endsWith('"'))) {
              return `"${keyPart}"`;
            }

            return keyPart;
        }
      }).join(' ')
    }`;
  };

  const validateAndChangeKey = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const key = convertToKey(input.value);

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
        value={convertKeyToString(internalKey)}
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
