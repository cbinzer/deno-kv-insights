import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

const ObjectValueFormControl: FunctionComponent<ObjectValueFormControlProps> = (
  { id, value = {}, onChange = () => {}, onInvalid = () => {} },
) => {
  const [stringValue, setStringValue] = useState('{}');
  const [isValueInvalid, setIsValueInvalid] = useState(false);

  useEffect(() => {
    try {
      setStringValue(JSON.stringify(value, undefined, 2));
      setIsValueInvalid(false);
    } catch (e) {
      setIsValueInvalid(true);
    }
  }, [value]);
  const changeValue = (event: Event) => {
    const textArea = event.target as HTMLTextAreaElement;
    setStringValue(textArea.value);

    try {
      const newValue = JSON.parse(textArea.value);
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
        class={`form-control value-form-control resize-none ${isValueInvalid ? 'is-invalid' : ''}`}
        id={id}
        value={stringValue}
        onChange={changeValue}
      />
      <div class='invalid-feedback'>Invalid object.</div>
    </>
  );
};

export interface ObjectValueFormControlProps {
  id?: string;
  value: Object;
  onChange?: (value: Object) => void;
  onInvalid?: () => void;
}

export default ObjectValueFormControl;
