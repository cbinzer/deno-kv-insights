import {HTTPKeyPart, KeyPart, ValueType} from './models.ts';
import {ValidationError} from '../common/errors.ts';

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
  return `[${
    key.map((keyPart) => {
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
    }).join(', ')
  }]`;
}

export function convertReadableKeyStringToKey(stringKey: string): KeyPart[] {
  return stringKey.split(' ').map((keyPart) => {
    const numberKeyPart = Number(keyPart);
    if (!isNaN(numberKeyPart)) {
      return numberKeyPart;
    }

    if (keyPart === 'true' || keyPart === 'false') {
      return keyPart === 'true';
    }

    if (keyPart.startsWith('[') && keyPart.endsWith(']') && keyPart.length > 2) {
      const numberArray: number[] = keyPart.substring(1, keyPart.length - 1).split(',').map((val) => Number(val));
      return new Int8Array(numberArray);
    }

    if (keyPart.startsWith('"') && keyPart.endsWith('"') && keyPart.length > 2) {
      return keyPart.substring(1, keyPart.length - 1);
    }

    return keyPart;
  }) as KeyPart[];
}

export function keyReviver(this: any, key: string, value: any): any {
  if (key === 'key') {
    return value.map(mapToKeyPart);
  }

  return value;
}

export function mapToKeyPart(httpKeyPart: HTTPKeyPart): KeyPart {
  if (typeof httpKeyPart === 'object') {
    try {
      return new Uint8Array(Object.values(httpKeyPart));
    } catch (e) {
      throw new ValidationError(`Can't create Uint8Array from ${JSON.stringify(httpKeyPart)}.`);
    }
  }

  return httpKeyPart as KeyPart;
}
