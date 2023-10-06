import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import ValueTypeDropdown from '../../entry/islands/valueTypeDropdown.tsx';
import { EntryValue, ValueType } from '../../entry/models.ts';
import EntryValueFormControl from '../../entry/islands/entryValueFormControl.tsx';
import { publishValue } from '../services/queueClientService.ts';

const QueueValuePublisher: FunctionComponent = () => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isValueInvalid, setIsValueInvalid] = useState(false);
  const [valueType, setValueType] = useState(ValueType.STRING);
  const [value, setValue] = useState<EntryValue>('');

  const changeValueType = (valueType: ValueType) => {
    setValueType(valueType);
    setIsValueInvalid(false);

    switch (valueType) {
      case ValueType.BOOLEAN:
        setValue(true);
        break;
      case ValueType.OBJECT:
        setValue({});
        break;
      case ValueType.NUMBER:
        setValue(0);
        break;
      case ValueType.STRING:
        setValue('');
        break;
      case ValueType.NULL:
        setValue(null);
        break;
      case ValueType.UNDEFINED:
        setValue(undefined);
        break;
      case ValueType.DATE:
        setValue(new Date());
        break;
      case ValueType.BIGINT:
        setValue(BigInt(0));
        break;
      case ValueType.UINT8ARRAY:
        setValue(new Uint8Array());
        break;
      case ValueType.REGEXP:
        setValue(new RegExp('.*', 'g'));
        break;
      case ValueType.SET:
        setValue(new Set());
        break;
      case ValueType.MAP:
        setValue(new Map());
        break;
    }
  };

  const changeValue = (value: EntryValue) => {
    setValue(value);
    setIsValueInvalid(false);
  };

  const publishEntryValue = async (event: Event) => {
    event.preventDefault();
    await publishValue(value);
  };

  return (
    <div class='queue-value-publisher'>
      <form onSubmit={publishEntryValue}>
        <div class='mb-3'>
          <label for='type' class='col-form-label'>Type:</label>
          <div id='type'>
            <ValueTypeDropdown valueType={valueType} onSelect={changeValueType} />
          </div>
        </div>
        <div class='mb-3'>
          {valueType !== ValueType.NULL && valueType !== ValueType.UNDEFINED
            ? (
              <>
                <label for='entryValue' class='col-form-label'>Value:</label>
                <EntryValueFormControl
                  id='entryValue'
                  valueType={valueType}
                  value={value}
                  onChange={changeValue}
                  onInvalid={() => setIsValueInvalid(true)}
                />
              </>
            )
            : null}
        </div>

        <div>
          <button
            type='submit'
            class='btn btn-primary float-end'
            disabled={isValueInvalid || isPublishing}
          >
            {isPublishing ? <span class='spinner-border spinner-border-sm' /> : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QueueValuePublisher;
