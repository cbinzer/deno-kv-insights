import { FunctionComponent, Ref } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { ValueType } from '../models.ts';
import { getValueTypeColorClass } from '../utils.ts';

const ValueTypeDropdown: FunctionComponent<ValueTypeDropdownProps> = (
  { valueType = ValueType.STRING, disabled, onSelect = () => {} },
) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<HTMLUListElement>();

  useEffect(() => {
    if (menuVisible) {
      document.addEventListener('mousedown', closeMenuOnOutsideClick);
    } else {
      document.removeEventListener('mousedown', closeMenuOnOutsideClick);
    }
  }, [menuVisible]);

  const closeMenuOnOutsideClick = useMemo(() => (event: Event) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuVisible(false);
    }
  }, undefined);

  const changeSelectedValueType = (event: Event, valueType: ValueType) => {
    event.preventDefault();
    setMenuVisible(false);
    onSelect(valueType);
  };

  const getAllValueTypes = (): ValueType[] => {
    const valueTypes: ValueType[] = [];
    for (const valueType in ValueType) {
      if (isNaN(Number(valueType))) {
        valueTypes.push(valueType as ValueType);
      }
    }

    return valueTypes;
  };

  return (
    <div class='btn-group'>
      <button
        class={`btn btn-secondary btn-sm dropdown-toggle ${getValueTypeColorClass(valueType)}`}
        type='button'
        disabled={disabled}
        onClick={() => setMenuVisible(!menuVisible)}
      >
        {valueType}
      </button>
      <ul
        class={`dropdown-menu ${menuVisible ? 'show' : ''}`}
        style={{ top: '35px' }}
        ref={menuRef as Ref<HTMLUListElement>}
      >
        {getAllValueTypes().map((valueType) => (
          <li>
            <a class='dropdown-item' href='#' onClick={(event) => changeSelectedValueType(event, valueType)}>
              {valueType}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export interface ValueTypeDropdownProps {
  valueType?: ValueType;
  disabled?: boolean;
  onSelect?: (valueType: ValueType) => void;
}

export default ValueTypeDropdown;
