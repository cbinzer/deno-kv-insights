import {EntryValue, HTTPEntryValue, HTTPKeyPart, KeyPart, ValueType} from './models.ts';
import { ValidationError } from '../common/errors.ts';

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

export function keyAndValueReviver(this: any, key: string, value: any): any {
  if (key === 'key') {
    return value.map(mapToKeyPart);
  }

  if (key === 'value') {
    return mapToEntryValue(value);
  }

  return value;
}

export function keyAndValueReplacer(key: string, value: any): any {
  if (key === 'key') {
    return value.map(replaceKeyPart);
  }

  if (key === 'value') {
    return replaceEntryValue(value);
  }

  return value;
}

export function replaceKeyPart(keyPart: KeyPart): HTTPKeyPart {
  if (typeof keyPart === 'bigint') {
    return `${keyPart.toString()}n`;
  }

  return keyPart as HTTPKeyPart;
}

export function replaceEntryValue(entryValue: EntryValue): HTTPEntryValue {
  if (typeof entryValue === 'bigint') {
    return `${entryValue.toString()}n`;
  }

  return entryValue as HTTPEntryValue;
}

export function mapToKeyPart(httpKeyPart: HTTPKeyPart): KeyPart {
  if (typeof httpKeyPart === 'object') {
    try {
      return new Uint8Array(Object.values(httpKeyPart));
    } catch (e) {
      throw new ValidationError(`Can't create Uint8Array from ${JSON.stringify(httpKeyPart)}.`);
    }
  }

  if (typeof httpKeyPart === 'string' && /^\d+n$/.test(httpKeyPart)) {
    return BigInt(httpKeyPart.substring(0, httpKeyPart.length - 1));
  }

  return httpKeyPart as KeyPart;
}

export function mapToEntryValue(value: unknown): EntryValue {
  if (typeof value === 'string' && /^\d+n$/.test(value)) {
    return BigInt(value.substring(0, value.length - 1));
  }

  return value as EntryValue;
}
