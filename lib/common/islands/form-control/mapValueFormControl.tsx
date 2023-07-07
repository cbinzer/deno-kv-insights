import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { replace, revive } from '../../../entry/utils.ts';

const MapValueFormControl: FunctionComponent<MapValueFormControlProps> = (
  { id, value = new Map(), disabled, onChange = () => {}, onInvalid = () => {} },
) => {
  const [stringValue, setStringValue] = useState('{}');
  const [isValueInvalid, setIsValueInvalid] = useState(false);

  useEffect(() => {
    try {
      const newObjectValue = Array.from(value.entries()).reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});
      setStringValue(JSON.stringify(newObjectValue, replace, 2));
      setIsValueInvalid(false);
    } catch (e) {
      setIsValueInvalid(true);
    }
  }, [value]);

  const changeValue = (event: Event) => {
    const textArea = event.target as HTMLTextAreaElement;
    setStringValue(textArea.value);

    try {
      const newValue = JSON.parse(textArea.value, revive);
      const newMapValue = new Map(Object.entries(newValue));
      setIsValueInvalid(false);
      onChange(newMapValue);
    } catch (e) {
      setIsValueInvalid(true);
      onInvalid();
    }
  };

  return (
    <>
      <textarea
        class={`form-control value-form-control resize-none text-area-min-height ${isValueInvalid ? 'is-invalid' : ''}`}
        id={id}
        value={stringValue}
        disabled={disabled}
        onChange={changeValue}
      />
      <div class='invalid-feedback'>Invalid Map.</div>
    </>
  );
};

export interface MapValueFormControlProps {
  id?: string;
  value: Map;
  disabled?: boolean;
  onChange?: (value: Map) => void;
  onInvalid?: () => void;
}

export default MapValueFormControl;
