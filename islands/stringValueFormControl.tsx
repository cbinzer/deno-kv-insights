import { FunctionComponent } from 'preact';

const StringValueFormControl: FunctionComponent<StringValueFormControlProps> = (
  { id, value = '', onChange = () => {} },
) => {
  const changeValue = (event: Event) => {
    const textArea = event.target as HTMLTextAreaElement;
    onChange(textArea.value);
  };

  return (
    <textarea
      class={`form-control value-form-control`}
      id={id}
      value={value}
      onInput={changeValue}
    />
  );
};

export interface StringValueFormControlProps {
  id?: string;
  value: string;
  onChange?: (value: string) => void;
}

export default StringValueFormControl;
