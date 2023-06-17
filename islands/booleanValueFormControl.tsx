import { FunctionComponent } from 'preact';

const BooleanValueFormControl: FunctionComponent<BooleanValueFormControlProps> = ({ id, value, onSelect = () => {} }) => {
  const selectValue = (event: Event) => {
    const radioElement = event.target as HTMLInputElement;
    onSelect(radioElement.value === 'true');
  };

  return (
    <>
      <div id={id}>
        <div class='form-check'>
          <input
            class='form-check-input'
            type='radio'
            id='trueValue'
            value='true'
            checked={value === true}
            onChange={selectValue}
          />
          <label class='form-check-label' for='trueValue'>true</label>
        </div>
        <div class='form-check'>
          <input
            class='form-check-input'
            type='radio'
            id='falseValue'
            value='false'
            checked={value === false}
            onChange={selectValue}
          />
          <label class='form-check-label' for='falseValue'>false</label>
        </div>
      </div>
    </>
  );
};

export interface BooleanValueFormControlProps {
  id?: string;
  value: boolean;
  onSelect?: (value: boolean) => void;
}

export default BooleanValueFormControl;
