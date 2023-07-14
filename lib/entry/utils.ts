import { KeyPart, ValueType } from './models.ts';

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

export function replace(key: string, value: any): any {
  if (typeof value === 'bigint') {
    return replaceBigInt(value);
  }

  if (value instanceof Uint8Array) {
    return replaceUint8Array(value);
  }

  if (value instanceof RegExp) {
    return replaceRegExp(value);
  }

  if (value instanceof Set) {
    return replaceSet(value);
  }

  if (value instanceof Map) {
    return replaceMap(value);
  }

  return value;
}

export function replaceBigInt(value: bigint): BigIntJSON {
  return {
    type: JSONType.BIGINT,
    value: value.toString(),
  };
}

export function replaceUint8Array(value: Uint8Array): Uint8ArrayJSON {
  return {
    type: JSONType.UINT8ARRAY,
    value: [...value],
  };
}

export function replaceRegExp(value: RegExp): RegExpJSON {
  return {
    type: JSONType.REGEXP,
    source: value.source,
    flags: value.flags,
  };
}

export function replaceSet(value: Set<unknown>): SetJSON {
  return {
    type: JSONType.SET,
    value: Array.from(value),
  };
}

export function replaceMap(value: Map<unknown, unknown>): MapJSON {
  return {
    type: JSONType.MAP,
    value: Array.from(value.entries()).reduce((obj, [key, val]) => ({ ...obj, [key as string]: val }), {}),
  };
}

export function revive(this: any, key: string, value: any): any {
  if (typeof value === 'object' && value !== null) {
    if (value.type === JSONType.BIGINT) {
      return reviveBigInt(value);
    }

    if (value.type === JSONType.UINT8ARRAY) {
      return reviveUint8Array(value);
    }

    if (value.type === JSONType.REGEXP) {
      return reviveRegExp(value);
    }

    if (value.type === JSONType.SET) {
      return reviveSet(value);
    }

    if (value.type === JSONType.MAP) {
      return reviveMap(value);
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

export function reviveRegExp(regExpJSON: RegExpJSON): RegExp {
  return new RegExp(regExpJSON.source, regExpJSON.flags);
}

export function reviveSet(setJSON: SetJSON): Set<unknown> {
  return new Set<unknown>(setJSON.value);
}

export function reviveMap(mapJSON: MapJSON): Map<unknown, unknown> {
  return new Map<unknown, unknown>(Object.entries(mapJSON.value));
}

enum JSONType {
  BIGINT = 'BIGINT',
  UINT8ARRAY = 'UINT8ARRAY',
  REGEXP = 'REGEXP',
  SET = 'SET',
  MAP = 'MAP',
}

interface BigIntJSON {
  type: JSONType.BIGINT;
  value: string;
}

interface Uint8ArrayJSON {
  type: JSONType.UINT8ARRAY;
  value: number[];
}

interface RegExpJSON {
  type: JSONType.REGEXP;
  source: string;
  flags?: string;
}

interface SetJSON {
  type: JSONType.SET;
  value: unknown[];
}

interface MapJSON {
  type: JSONType.MAP;
  value: Record<string, unknown>;
}
