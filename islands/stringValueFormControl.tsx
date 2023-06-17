import { FunctionComponent } from 'preact';

const StringValueFormControl: FunctionComponent<StringValueFormControlProps> = (
  { value = '', onChange = () => {} },
) => {
  const changeValue = (event: Event) => {
    const textArea = event.target as HTMLTextAreaElement;
    onChange(textArea.value);
  };

  return (
    <>
      <label for='stringValue' class='col-form-label'>Value:</label>
      <textarea
        class={`form-control value-form-control`}
        id='stringValue'
        value={value}
        onInput={changeValue}
      />
    </>
  );
};

export interface StringValueFormControlProps {
  value: string;
  onChange?: (value: string) => void;
}

export default StringValueFormControl;