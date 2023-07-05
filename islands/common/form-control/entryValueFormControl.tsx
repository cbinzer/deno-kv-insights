import { FunctionComponent } from 'preact';
import { EntryValue, ValueType } from '../../../lib/entry/models.ts';
import BooleanValueFormControl from './booleanValueFormControl.tsx';
import NumberValueFormControl from './numberValueFormControl.tsx';
import StringValueFormControl from './stringValueFormControl.tsx';
import ObjectValueFormControl from './objectValueFormControl.tsx';
import DateValueFormControl from './dateValueFormControl.tsx';
import BigIntValueFormControl from './bigIntValueFormControl.tsx';
import Uint8ArrayValueFormControl from './uint8ArrayValueFormControl.tsx';
import RegExpValueFormControl from './regExpValueFormControl.tsx';

const EntryValueFormControl: FunctionComponent<EntryValueFormControlProps> = (
  { id, valueType, value, disabled, onChange = () => {}, onInvalid = () => {} },
) => {
  return (
    <>
      {valueType === ValueType.BOOLEAN
        ? <BooleanValueFormControl id={id} value={value as boolean} disabled={disabled} onSelect={onChange} />
        : null}
      {valueType === ValueType.NUMBER
        ? <NumberValueFormControl id={id} value={value as number} disabled={disabled} onChange={onChange} />
        : null}
      {valueType === ValueType.STRING
        ? <StringValueFormControl id={id} value={value as string} disabled={disabled} onChange={onChange} />
        : null}
      {valueType === ValueType.OBJECT
        ? (
          <ObjectValueFormControl
            id={id}
            value={value as Object}
            disabled={disabled}
            onChange={onChange}
            onInvalid={onInvalid}
          />
        )
        : null}
      {valueType === ValueType.DATE
        ? <DateValueFormControl id={id} value={value as Date} disabled={disabled} onChange={onChange} />
        : null}
      {valueType === ValueType.BIGINT
        ? <BigIntValueFormControl id={id} value={value as bigint} disabled={disabled} onChange={onChange} />
        : null}
      {valueType === ValueType.UINT8ARRAY
        ? (
          <Uint8ArrayValueFormControl
            id={id}
            value={value as Uint8Array}
            disabled={disabled}
            onChange={onChange}
            onInvalid={onInvalid}
          />
        )
        : null}
      {valueType === ValueType.REGEXP
        ? (
          <RegExpValueFormControl
            id={id}
            value={value as RegExp}
            disabled={disabled}
            onChange={onChange}
            onInvalid={onInvalid}
          />
        )
        : null}
    </>
  );
};

export interface EntryValueFormControlProps {
  id?: string;
  valueType: ValueType;
  value: EntryValue;
  disabled?: boolean;
  onChange?: (value: EntryValue) => void;
  onInvalid?: () => void;
}

export default EntryValueFormControl;
