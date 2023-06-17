import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'https://esm.sh/stable/preact@10.11.0/denonext/hooks.js';

const DateValueFormControl: FunctionComponent<DateValueFormControlProps> = (
  { value = new Date(), onChange = () => {} },
) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => setInternalValue(value), [value]);

  const changeValue = (event: Event) => {
    const inputElement = event.target as HTMLInputElement;
    let newValue = new Date(inputElement.value);
    if (!newValue) {
      newValue = new Date();
    }

    setInternalValue(newValue);
    onChange(newValue);
  };

  const formatDate = (date: Date): string => {
    return (new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString()).slice(0, -5);
  };

  return (
    <>
      <label for='dateValue' class='form-label'>Value</label>
      <input
        type='datetime-local'
        class='form-control'
        id='dateValue'
        value={formatDate(internalValue)}
        onChange={changeValue}
      />
    </>
  );
};

export interface DateValueFormControlProps {
  value: Date;
  onChange?: (value: Date) => void;
}

export default DateValueFormControl;
