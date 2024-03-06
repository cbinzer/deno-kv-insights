import { FunctionComponent } from 'preact';
import { EntryValue, ValueType } from '../models.ts';
import BooleanValueFormControl from '../../common/islands/form-control/booleanValueFormControl.tsx';
import NumberValueFormControl from '../../common/islands/form-control/numberValueFormControl.tsx';
import StringValueFormControl from '../../common/islands/form-control/stringValueFormControl.tsx';
import ObjectValueFormControl from '../../common/islands/form-control/objectValueFormControl.tsx';
import DateValueFormControl from '../../common/islands/form-control/dateValueFormControl.tsx';
import BigIntValueFormControl from '../../common/islands/form-control/bigIntValueFormControl.tsx';
import Uint8ArrayValueFormControl from '../../common/islands/form-control/uint8ArrayValueFormControl.tsx';
import RegExpValueFormControl from '../../common/islands/form-control/regExpValueFormControl.tsx';
import SetValueFormControl from '../../common/islands/form-control/setValueFormControl.tsx';
import MapValueFormControl from '../../common/islands/form-control/mapValueFormControl.tsx';

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
      {valueType === ValueType.SET
        ? (
          <SetValueFormControl
            id={id}
            value={value as Set<unknown>}
            disabled={disabled}
            onChange={onChange}
            onInvalid={onInvalid}
          />
        )
        : null}
      {valueType === ValueType.MAP
        ? (
          <MapValueFormControl
            id={id}
            value={value as Map<string, unknown>}
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
