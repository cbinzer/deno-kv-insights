import { FunctionComponent } from 'preact';
import { useState } from 'preact/hooks';
import { ValueType } from '../lib/entry/models.ts';
import { getValueTypeColorClass } from '../lib/entry/utils.ts';

const ValueTypeDropdown: FunctionComponent<ValueTypeDropdownProps> = (
  { valueType = ValueType.STRING, onSelect = () => {} },
) => {
  const [selectedValueType, setSelectedValueType] = useState<ValueType>(valueType);
  const [menuVisible, setMenuVisible] = useState(false);

  const changeSelectedValueType = (event: Event, valueType: ValueType) => {
    event.preventDefault();

    setSelectedValueType(valueType);
    setMenuVisible(false);
    onSelect(valueType);
  };

  return (
    <div class='btn-group'>
      <button
        class={`btn btn-secondary btn-sm dropdown-toggle ${getValueTypeColorClass(selectedValueType)}`}
        type='button'
        onClick={() => setMenuVisible(!menuVisible)}
      >
        {selectedValueType}
      </button>
      <ul class={`dropdown-menu ${menuVisible ? 'show' : ''}`} style={{ top: '35px' }}>
        <li>
          <a class='dropdown-item' href='#' onClick={(event) => changeSelectedValueType(event, ValueType.STRING)}>
            {ValueType.STRING}
          </a>
        </li>
        <li>
          <a class='dropdown-item' href='#' onClick={(event) => changeSelectedValueType(event, ValueType.OBJECT)}>
            {ValueType.OBJECT}
          </a>
        </li>
        <li>
          <a class='dropdown-item' href='#' onClick={(event) => changeSelectedValueType(event, ValueType.BOOLEAN)}>
            {ValueType.BOOLEAN}
          </a>
        </li>
        <li>
          <a class='dropdown-item' href='#' onClick={(event) => changeSelectedValueType(event, ValueType.NUMBER)}>
            {ValueType.NUMBER}
          </a>
        </li>
      </ul>
    </div>
  );
};

export interface ValueTypeDropdownProps {
  valueType?: ValueType;
  onSelect?: (valueType: ValueType) => void;
}

export default ValueTypeDropdown;
