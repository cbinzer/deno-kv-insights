import { Status } from '../../deps.ts';
import { BigIntJSON, DateJSON, HTTPError, JSONType, MapJSON, RegExpJSON, SetJSON, Uint8ArrayJSON } from './models.ts';
import { EntryAlreadyExistsError, EntryNotFoundError, ValidationError, VersionConflictError } from './errors.ts';

export function mapToHTTPError(error: Error): HTTPError {
  if (error instanceof ValidationError) {
    return {
      status: Status.BadRequest,
      message: error.message,
    };
  }

  if (error instanceof EntryNotFoundError) {
    return {
      status: Status.NotFound,
      message: error.message,
    };
  }

  if (error instanceof EntryAlreadyExistsError || error instanceof VersionConflictError) {
    return {
      status: Status.Conflict,
      message: error.message,
    };
  }

  return {
    status: Status.InternalServerError,
    message: 'An unknown error occurred.',
  };
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

  //@ts-ignore
  if (this[key] instanceof Date) {
    //@ts-ignore
    return replaceDate(this[key]);
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

export function replaceDate(value: Date): DateJSON {
  return {
    type: JSONType.DATE,
    value: value.toISOString(),
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

    if (value.type === JSONType.DATE) {
      return reviveDate(value);
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

export function reviveDate(dateJSON: DateJSON): Date {
  return new Date(dateJSON.value);
}
