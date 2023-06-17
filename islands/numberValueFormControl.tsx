import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

const NumberValueFormControl: FunctionComponent<NumberValueFormControlProps> = ({ value = 0, onChange = () => {} }) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => setInternalValue(value), [value]);

  const changeValue = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    let newValue = inputElement.valueAsNumber;
    if (isNaN(inputElement.valueAsNumber)) {
      newValue = 0;
    }

    setInternalValue(newValue);
    onChange(newValue)
  };

  return (
    <>
      <label for='numberValue' class='form-label'>Value</label>
      <input type='number' class='form-control' id='numberValue' value={internalValue} onChange={changeValue} />
    </>
  );
};

export interface NumberValueFormControlProps {
  value: number;
  onChange?: (value: number) => void;
}

export default NumberValueFormControl;
