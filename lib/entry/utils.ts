import { Entry, ValueType } from './models.ts';

export function getValueTypeColorClass(valueType: ValueType): string {
  switch (valueType) {
    case ValueType.NUMBER:
      return 'text-bg-primary';
    case ValueType.STRING:
      return 'text-bg-secondary';
    case ValueType.BOOLEAN:
      return 'text-bg-success';
    case ValueType.OBJECT:
      return 'text-bg-danger';
    case ValueType.UNDEFINED:
      return 'text-bg-warning';
    case ValueType.NULL:
      return 'text-bg-info';
    default:
      return 'text-bg-light';
  }
}

export function convertEntryValueToString(entry: Entry): string {
  switch (entry.valueType) {
    case ValueType.NUMBER:
      return (entry.value as number).toString();
    case ValueType.STRING:
      return entry.value as string;
    case ValueType.BOOLEAN:
      return (entry.value as boolean).toString();
    case ValueType.OBJECT:
      return JSON.stringify(entry.value, undefined, 2);
    case ValueType.UNDEFINED:
      return '';
    case ValueType.NULL:
      return '';
    default:
      return '';
  }
}
