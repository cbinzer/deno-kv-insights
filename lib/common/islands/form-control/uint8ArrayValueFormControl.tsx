import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

const Uint8ArrayValueFormControl: FunctionComponent<Uint8ArrayValueFormControlProps> = (
  { id, value = new Uint8Array(), disabled, onChange = () => {}, onInvalid = () => {} },
) => {
  const [stringValue, setStringValue] = useState('[]');
  const [isValueInvalid, setIsValueInvalid] = useState(false);

  useEffect(() => {
    try {
      const arrayValue = [...value];
      setStringValue(JSON.stringify(arrayValue, undefined, 2));
      setIsValueInvalid(false);
    } catch (e) {
      setIsValueInvalid(true);
    }
  }, [value]);

  const changeValue = (event: Event) => {
    const textArea = event.target as HTMLTextAreaElement;
    setStringValue(textArea.value);

    try {
      const newArrayValue = JSON.parse(textArea.value);
      const newValue = new Uint8Array(newArrayValue);
      setIsValueInvalid(false);
      onChange(newValue);
    } catch (e) {
      setIsValueInvalid(true);
      onInvalid();
    }
  };

  return (
    <>
      <textarea
        class={`form-control value-form-control resize-none text-area-min-height ${isValueInvalid ? 'is-invalid' : ''}`}
        id={id}
        value={stringValue}
        disabled={disabled}
        onChange={changeValue}
      />
      <div class='invalid-feedback'>Invalid Uint8Array.</div>
    </>
  );
};

export interface Uint8ArrayValueFormControlProps {
  id?: string;
  value: Uint8Array;
  disabled?: boolean;
  onChange?: (value: Uint8Array) => void;
  onInvalid?: () => void;
}

export default Uint8ArrayValueFormControl;
