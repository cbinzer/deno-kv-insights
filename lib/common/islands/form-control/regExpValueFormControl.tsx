import { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';

const RegExpValueFormControl: FunctionComponent<RegExpValueFormControlProps> = (
  { id, value = new RegExp('.*', 'g'), disabled, onChange = () => {}, onInvalid = () => {} },
) => {
  const [stringValue, setStringValue] = useState(value.source);
  const [flags, setFlags] = useState(value.flags);
  const [isValueInvalid, setIsValueInvalid] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    try {
      setStringValue(value.source);
      setFlags(value.flags);
      setIsValueInvalid(false);
    } catch (e) {
      setIsValueInvalid(true);
    }
  }, [value]);

  const changeFlags = (event: Event, selectedFlag: string) => {
    event.preventDefault();

    let newFlags = flags + selectedFlag;
    if (flags?.includes(selectedFlag)) {
      newFlags = flags.replace(selectedFlag, '');
    }
    setFlags(newFlags);

    try {
      const newValue = new RegExp(stringValue, newFlags);
      setIsValueInvalid(false);
      onChange(newValue);
    } catch (e) {
      setIsValueInvalid(true);
      onInvalid();
    }
  };

  const changeValue = (event: Event) => {
    const textArea = event.target as HTMLTextAreaElement;
    setStringValue(textArea.value);

    try {
      const newValue = new RegExp(textArea.value, flags);
      setIsValueInvalid(false);
      onChange(newValue);
    } catch (e) {
      setIsValueInvalid(true);
      onInvalid();
    }
  };

  const toggleMenu = (event: Event) => {
    event.preventDefault();
    setMenuVisible(!menuVisible);
  };

  return (
    <>
      <div class='input-group has-validation'>
        <span class='input-group-text'>/</span>
        <input
          class={`form-control ${isValueInvalid ? 'is-invalid' : ''}`}
          type='text'
          placeholder='Insert your regular expression here'
          id={id}
          value={stringValue}
          disabled={disabled}
          onChange={changeValue}
        />
        <button class='btn btn-outline-secondary dropdown-toggle' onClick={toggleMenu}>/{flags}</button>
        <ul class={`dropdown-menu dropdown-menu-end ${menuVisible ? 'show' : ''}`} style={{ top: '42px', right: '0' }}>
          <li>
            <a
              class={`dropdown-item ${flags?.includes('g') ? 'active' : ''}`}
              href='#'
              onClick={(event) => changeFlags(event, 'g')}
            >
              global
            </a>
          </li>
          <li>
            <a
              class={`dropdown-item ${flags?.includes('m') ? 'active' : ''}`}
              href='#'
              onClick={(event) => changeFlags(event, 'm')}
            >
              multiline
            </a>
          </li>
          <li>
            <a
              class={`dropdown-item ${flags?.includes('i') ? 'active' : ''}`}
              href='#'
              onClick={(event) => changeFlags(event, 'i')}
            >
              insensitive
            </a>
          </li>
          <li>
            <a
              class={`dropdown-item ${flags?.includes('y') ? 'active' : ''}`}
              href='#'
              onClick={(event) => changeFlags(event, 'y')}
            >
              sticky
            </a>
          </li>
          <li>
            <a
              class={`dropdown-item ${flags?.includes('u') ? 'active' : ''}`}
              href='#'
              onClick={(event) => changeFlags(event, 'u')}
            >
              unicode
            </a>
          </li>
          <li>
            <a
              class={`dropdown-item ${flags?.includes('v') ? 'active' : ''}`}
              href='#'
              onClick={(event) => changeFlags(event, 'v')}
            >
              vnicode
            </a>
          </li>
          <li>
            <a
              class={`dropdown-item ${flags?.includes('s') ? 'active' : ''}`}
              href='#'
              onClick={(event) => changeFlags(event, 's')}
            >
              single line
            </a>
          </li>
          <li>
            <a
              class={`dropdown-item ${flags?.includes('d') ? 'active' : ''}`}
              href='#'
              onClick={(event) => changeFlags(event, 'd')}
            >
              indices
            </a>
          </li>
        </ul>
        <div class='invalid-feedback'>Invalid RegExp.</div>
      </div>
    </>
  );
};

export interface RegExpValueFormControlProps {
  id?: string;
  value: RegExp;
  disabled?: boolean;
  onChange?: (value: RegExp) => void;
  onInvalid?: () => void;
}

export default RegExpValueFormControl;
