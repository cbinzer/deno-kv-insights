import { KeyPart, ValueType } from './models.ts';

export function getValueTypeColorClass(valueType: ValueType): string {
  switch (valueType) {
    case ValueType.BIGINT:
    case ValueType.NUMBER:
      return 'text-bg-primary';
    case ValueType.STRING:
      return 'text-bg-secondary';
    case ValueType.BOOLEAN:
      return 'text-bg-success';
    case ValueType.OBJECT:
    case ValueType.UINT8ARRAY:
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

    if (/^\d+n$/.test(keyPart)) {
      return BigInt(keyPart.substring(0, keyPart.length - 1));
    }

    if (keyPart.startsWith('"') && keyPart.endsWith('"') && keyPart.length > 2) {
      return keyPart.substring(1, keyPart.length - 1);
    }

    return keyPart;
  }) as KeyPart[];
}

export function replace(key: string, value: any): any {
  if (typeof value === 'bigint') {
    return replaceBigInt(value);
  }

  if (value instanceof Uint8Array) {
    return replaceUint8Array(value);
  }

  return value;
}

export function replaceBigInt(value: bigint): BigIntJSON {
  return {
    type: JSONType.BIGINT,
    value: value.toString(),
  };
}

export function replaceUint8Array(value: Uint8Array) {
  return {
    type: JSONType.UINT8ARRAY,
    value: [...value],
  };
}

export function revive(this: any, key: string, value: any): any {
  if (typeof value === 'object') {
    if (value.type === JSONType.BIGINT) {
      return reviveBigInt(value);
    }

    if (value.type === JSONType.UINT8ARRAY) {
      return reviveUint8Array(value);
    }
  }

  return value;
}

export function reviveBigInt(bigIntJSON: BigIntJSON): bigint {
  return BigInt(bigIntJSON.value);
}

export function reviveUint8Array(uint8ArrayJSON: Uint8ArrayJSON): Uint8Array {
  return new Uint8Array(uint8ArrayJSON.value);
}

enum JSONType {
  BIGINT = 'BIGINT',
  UINT8ARRAY = 'UINT8ARRAY',
}

interface BigIntJSON {
  type: JSONType.BIGINT;
  value: string;
}

interface Uint8ArrayJSON {
  type: JSONType.UINT8ARRAY;
  value: number[];
}
