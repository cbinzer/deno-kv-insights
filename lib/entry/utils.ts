import { ValueType } from './models.ts';

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
