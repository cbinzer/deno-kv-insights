import { FunctionComponent } from 'preact';
import { EntryValue, ValueType } from '../lib/entry/models.ts';
import BooleanValueFormControl from './booleanValueFormControl.tsx';
import NumberValueFormControl from './numberValueFormControl.tsx';
import StringValueFormControl from './stringValueFormControl.tsx';
import ObjectValueFormControl from './objectValueFormControl.tsx';
import DateValueFormControl from './dateValueFormControl.tsx';

const EntryValueFormControl: FunctionComponent<EntryValueFormControlProps> = (
  { id, valueType, value, onChange = () => {} },
) => {
  return (
    <>
      {valueType === ValueType.BOOLEAN
        ? <BooleanValueFormControl id={id} value={value as boolean} onSelect={onChange} />
        : null}
      {valueType === ValueType.NUMBER
        ? <NumberValueFormControl id={id} value={value as number} onChange={onChange} />
        : null}
      {valueType === ValueType.STRING
        ? <StringValueFormControl id={id} value={value as string} onChange={onChange} />
        : null}
      {valueType === ValueType.OBJECT
        ? <ObjectValueFormControl id={id} value={value as Object} onChange={onChange} />
        : null}
      {valueType === ValueType.DATE ? <DateValueFormControl id={id} value={value as Date} onChange={onChange} /> : null}
    </>
  );
};

export interface EntryValueFormControlProps {
  id?: string;
  valueType: ValueType;
  value: EntryValue;
  onChange?: (value: EntryValue) => void;
}

export default EntryValueFormControl;
