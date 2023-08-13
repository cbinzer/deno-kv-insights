import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { replace, revive } from "../../httpUtils.ts";

const SetValueFormControl: FunctionComponent<SetValueFormControlProps> = (
  { id, value = new Set(), disabled, onChange = () => {}, onInvalid = () => {} },
) => {
  const [stringValue, setStringValue] = useState('[]');
  const [isValueInvalid, setIsValueInvalid] = useState(false);

  useEffect(() => {
    try {
      const newArrayValue = Array.from(value);
      setStringValue(JSON.stringify(newArrayValue, replace, 2));
      setIsValueInvalid(false);
    } catch (e) {
      setIsValueInvalid(true);
    }
  }, [value]);

  const changeValue = (event: Event) => {
    const textArea = event.target as HTMLTextAreaElement;
    setStringValue(textArea.value);

    try {
      const newArrayValue = JSON.parse(textArea.value, revive);
      const newSetValue = new Set(newArrayValue);
      setIsValueInvalid(false);
      onChange(newSetValue);
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
      <div class='invalid-feedback'>Invalid Set.</div>
    </>
  );
};

export interface SetValueFormControlProps {
  id?: string;
  value: Set;
  disabled?: boolean;
  onChange?: (value: Set) => void;
  onInvalid?: () => void;
}

export default SetValueFormControl;
