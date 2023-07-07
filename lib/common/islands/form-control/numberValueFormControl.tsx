import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

const NumberValueFormControl: FunctionComponent<NumberValueFormControlProps> = (
  { id, value = 0, disabled, onChange = () => {} },
) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => setInternalValue(value), [value]);

  const changeValue = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    let newValue = inputElement.valueAsNumber;
    if (isNaN(inputElement.valueAsNumber)) {
      newValue = internalValue;
    }

    setInternalValue(newValue);
    onChange(newValue);
  };

  const increment = (event: Event) => {
    event.preventDefault();

    const newValue = internalValue + 1;
    setInternalValue(newValue);
    onChange(newValue);
  };

  const decrement = (event: Event) => {
    event.preventDefault();

    const newValue = internalValue - 1;
    setInternalValue(newValue);
    onChange(newValue);
  };

  return (
    <div class='input-group'>
      <button class='btn btn-outline-secondary' onClick={decrement} disabled={disabled}>-</button>
      <input
        type='text'
        class='form-control'
        id={id}
        value={internalValue}
        disabled={disabled}
        onChange={changeValue}
      />
      <button class='btn btn-outline-secondary' onClick={increment} disabled={disabled}>+</button>
    </div>
  );
};

export interface NumberValueFormControlProps {
  id?: string;
  value: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
}

export default NumberValueFormControl;
