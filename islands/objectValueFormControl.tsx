import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

const ObjectValueFormControl: FunctionComponent<ObjectValueFormControlProps> = (
  { value = {}, onChange = () => {} },
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
    }
  };

  return (
    <>
      <label for='objectValue' class='col-form-label'>Value:</label>
      <textarea
        class={`form-control value-form-control ${isValueInvalid ? 'is-invalid' : ''}`}
        id='objectValue'
        value={stringValue}
        onChange={changeValue}
      />
      <div class='invalid-feedback'>Invalid object.</div>
    </>
  );
};

export interface ObjectValueFormControlProps {
  value: Object;
  onChange?: (value: Object) => void;
}

export default ObjectValueFormControl;
