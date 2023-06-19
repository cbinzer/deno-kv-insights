import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { ValueType } from '../../lib/entry/models.ts';
import { getValueTypeColorClass } from '../../lib/entry/utils.ts';

const ValueTypeDropdown: FunctionComponent<ValueTypeDropdownProps> = (
  { valueType = ValueType.STRING, onSelect = () => {} },
) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const changeSelectedValueType = (event: Event, valueType: ValueType) => {
    event.preventDefault();
    setMenuVisible(false);
    onSelect(valueType);
  };

  const getAllValueTypes = (): ValueType[] => {
    const valueTypes: ValueType[] = [];
    for (const valueType in ValueType) {
      if (isNaN(Number(valueType))) {
        valueTypes.push(valueType);
      }
    }

    return valueTypes;
  };

  return (
    <div class='btn-group'>
      <button
        class={`btn btn-secondary btn-sm dropdown-toggle ${getValueTypeColorClass(valueType)}`}
        type='button'
        onClick={() => setMenuVisible(!menuVisible)}
      >
        {valueType}
      </button>
      <ul class={`dropdown-menu ${menuVisible ? 'show' : ''}`} style={{ top: '35px' }}>
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
  onSelect?: (valueType: ValueType) => void;
}

export default ValueTypeDropdown;
