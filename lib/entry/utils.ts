import { KeyPart, ValueType } from './models.ts';

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
    case ValueType.DATE:
      return 'text-bg-dark';
    default:
      return 'text-bg-light';
  }
}

export function convertKeyToString(key: KeyPart[]): string {
  return `[${key.map((keyPart) => {
    switch (typeof keyPart) {
      case 'number':
      case 'bigint':
      case 'boolean':
        return keyPart.toString();
      case 'object':
        return `[${(keyPart as Uint8Array).join(',')}]`;
      default:
        return `"${keyPart}"`;
    }
  }).join(', ')}]`;
}
