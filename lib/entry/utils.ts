import { KeyPart, ValueType } from './models.ts';
import { ValidationError } from '../common/errors.ts';

export function getValueTypeColorClass(valueType: ValueType): string {
  switch (valueType) {
    case ValueType.BIGINT:
    case ValueType.NUMBER:
      return 'text-bg-primary';
    case ValueType.STRING:
    case ValueType.REGEXP:
      return 'text-bg-secondary';
    case ValueType.BOOLEAN:
      return 'text-bg-success';
    case ValueType.OBJECT:
    case ValueType.UINT8ARRAY:
    case ValueType.SET:
    case ValueType.MAP:
      return 'text-bg-danger';
    case ValueType.UNDEFINED:
    case ValueType.NULL:
      return 'text-bg-warning';
    case ValueType.DATE:
      return 'text-bg-dark';
    default:
      return 'text-bg-light';
  }
}

export function convertKeyToString(key: KeyPart[]): string {
  return `[${
    key.map((keyPart) => {
      switch (typeof keyPart) {
        case 'bigint':
          return `${keyPart.toString()}n`;
        case 'number':
        case 'boolean':
          return keyPart.toString();
        case 'object':
          return `[${(keyPart as Uint8Array).join(',')}]`;
        default:
          return `"${keyPart.toString()}"`;
      }
    }).join(', ')
  }]`;
}

export function convertReadableKeyStringToKey(stringKey: string): KeyPart[] {
  return stringKey.split(' ').filter((keyPart) => keyPart !== '').map((keyPart) => {
    const numberKeyPart = Number(keyPart);
    if (!isNaN(numberKeyPart)) {
      return numberKeyPart;
    }

    if (keyPart === 'true' || keyPart === 'false') {
      return keyPart === 'true';
    }

    if (keyPart.startsWith('[') && keyPart.endsWith(']') && keyPart.length > 2) {
      const numberArray: number[] = keyPart.substring(1, keyPart.length - 1).split(',').map((val) => Number(val));
      return new Uint8Array(numberArray);
    }

    if (/^\d+n$/.test(keyPart)) {
      return BigInt(keyPart.substring(0, keyPart.length - 1));
    }

    if (keyPart.startsWith('"') && keyPart.endsWith('"') && keyPart.length > 2) {
      return keyPart.substring(1, keyPart.length - 1);
    }

    return keyPart;
  }) as KeyPart[];
}
export function getValueType(value: unknown): ValueType {
  if (value === null) {
    return ValueType.NULL;
  }

  if (value instanceof Date) {
    return ValueType.DATE;
  }

  if (value instanceof Uint8Array) {
    return ValueType.UINT8ARRAY;
  }

  if (value instanceof RegExp) {
    return ValueType.REGEXP;
  }

  if (value instanceof Set) {
    return ValueType.SET;
  }

  if (value instanceof Map) {
    return ValueType.MAP;
  }

  switch (typeof value) {
    case 'object':
      return ValueType.OBJECT;
    case 'boolean':
      return ValueType.BOOLEAN;
    case 'number':
      return ValueType.NUMBER;
    case 'undefined':
      return ValueType.UNDEFINED;
    case 'string':
      return ValueType.STRING;
    case 'bigint':
      return ValueType.BIGINT;
    default:
      throw new ValidationError(`Can't find the matching value type for ${typeof value}.`);
  }
}
