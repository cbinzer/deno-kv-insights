import { KeyPart } from '../models.ts';
import {
  encodeBigIntKeyPart,
  encodeBooleanKeyPart,
  encodeBytesKeyPart,
  encodeNumberKeyPart,
  encodeStringKeyPart,
  instantiate,
} from '../codec/codec.generated.js';
import { encode } from '../../../deps.ts';

await instantiate();

export function encodeCursor(key: KeyPart[]): string {
  const uInt8Arrays: Uint8Array[] = [];

  key.forEach((keyPart) => {
    switch (typeof keyPart) {
      case 'number':
        uInt8Arrays.push(encodeNumberKeyPart(keyPart));
        break;
      case 'bigint':
        uInt8Arrays.push(encodeBigIntKeyPart(keyPart));
        break;
      case 'boolean':
        uInt8Arrays.push(encodeBooleanKeyPart(keyPart));
        break;
      case 'object':
        uInt8Arrays.push(encodeBytesKeyPart(keyPart));
        break;
      case 'string':
        uInt8Arrays.push(encodeStringKeyPart(keyPart));
        break;
    }
  });

  return encode(mergeUint8Arrays(...uInt8Arrays)).replaceAll('/', '_');
}

function mergeUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
  const totalSize = arrays.reduce((acc, e) => acc + e.length, 0);
  const merged = new Uint8Array(totalSize);

  arrays.forEach((array, i, arrays) => {
    const offset = arrays.slice(0, i).reduce((acc, e) => acc + e.length, 0);
    merged.set(array, offset);
  });

  return merged;
}
