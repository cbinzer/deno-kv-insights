import { FunctionComponent } from 'preact';

const StringValueFormControl: FunctionComponent<StringValueFormControlProps> = (
  { id, value = '', disabled, onChange = () => {} },
) => {
  const changeValue = (event: Event) => {
    const textArea = event.target as HTMLTextAreaElement;
    onChange(textArea.value);
  };

  return (
    <textarea
      class={`form-control value-form-control resize-none text-area-min-height`}
      id={id}
      value={value}
      disabled={disabled}
      onInput={changeValue}
    />
  );
};

export interface StringValueFormControlProps {
  id?: string;
  value: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

export default StringValueFormControl;
