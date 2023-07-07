import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

const BigIntValueFormControl: FunctionComponent<BigIntValueFormControlProps> = (
  { id, value = BigInt(0), disabled, onChange = () => {} },
) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => setInternalValue(value), [value]);

  const changeValue = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;

    let newValue: bigint;
    try {
      newValue = BigInt(inputElement.value);
    } catch (e) {
      newValue = BigInt(internalValue);
    }

    setInternalValue(newValue);
    onChange(newValue);
  };

  const increment = (event: Event) => {
    event.preventDefault();

    const newValue = internalValue + BigInt(1);
    setInternalValue(newValue);
    onChange(newValue);
  };

  const decrement = (event: Event) => {
    event.preventDefault();

    const newValue = internalValue - BigInt(1);
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

export interface BigIntValueFormControlProps {
  id?: string;
  value: bigint;
  disabled?: boolean;
  onChange?: (value: bigint) => void;
}

export default BigIntValueFormControl;
