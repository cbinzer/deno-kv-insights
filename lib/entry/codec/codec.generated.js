// @generated file from wasmbuild -- do not edit
// deno-lint-ignore-file
// deno-fmt-ignore-file
// source-hash: ded0001325fa10e7955ef53ef6554af6db7a0767
let wasm;

const cachedTextDecoder = typeof TextDecoder !== 'undefined'
  ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true })
  : {
    decode: () => {
      throw Error('TextDecoder not available');
    },
  };

if (typeof TextDecoder !== 'undefined') cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
  if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : {
  encode: () => {
    throw Error('TextEncoder not available');
  },
};

const encodeString = function (arg, view) {
  return cachedTextEncoder.encodeInto(arg, view);
};

function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length) >>> 0;
    getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len) >>> 0;

  const mem = getUint8Memory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7F) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3) >>> 0;
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
  if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachedInt32Memory0;
}

function getArrayU8FromWasm0(ptr, len) {
  ptr = ptr >>> 0;
  return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
 * @param {string} key_part
 * @returns {Uint8Array}
 */
export function encodeStringKeyPart(key_part) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passStringToWasm0(key_part, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.encodeStringKeyPart(retptr, ptr0, len0);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var v2 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 1);
    return v2;
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

/**
 * @param {boolean} key_part
 * @returns {Uint8Array}
 */
export function encodeBooleanKeyPart(key_part) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    wasm.encodeBooleanKeyPart(retptr, key_part);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var v1 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 1);
    return v1;
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

function passArray8ToWasm0(arg, malloc) {
  const ptr = malloc(arg.length * 1) >>> 0;
  getUint8Memory0().set(arg, ptr / 1);
  WASM_VECTOR_LEN = arg.length;
  return ptr;
}
/**
 * @param {Uint8Array} key_part
 * @returns {Uint8Array}
 */
export function encodeBytesKeyPart(key_part) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    const ptr0 = passArray8ToWasm0(key_part, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.encodeBytesKeyPart(retptr, ptr0, len0);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var v2 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 1);
    return v2;
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

/**
 * @param {bigint} key_part
 * @returns {Uint8Array}
 */
export function encodeBigIntKeyPart(key_part) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    wasm.encodeBigIntKeyPart(retptr, key_part);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var v1 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 1);
    return v1;
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

/**
 * @param {number} key_part
 * @returns {Uint8Array}
 */
export function encodeNumberKeyPart(key_part) {
  try {
    const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
    wasm.encodeNumberKeyPart(retptr, key_part);
    var r0 = getInt32Memory0()[retptr / 4 + 0];
    var r1 = getInt32Memory0()[retptr / 4 + 1];
    var v1 = getArrayU8FromWasm0(r0, r1).slice();
    wasm.__wbindgen_free(r0, r1 * 1);
    return v1;
  } finally {
    wasm.__wbindgen_add_to_stack_pointer(16);
  }
}

const imports = {
  __wbindgen_placeholder__: {
    __wbindgen_throw: function (arg0, arg1) {
      throw new Error(getStringFromWasm0(arg0, arg1));
    },
  },
};

import { Loader } from 'https://deno.land/x/wasmbuild@0.14.1/loader.ts';
import { cacheToLocalDir } from 'https://deno.land/x/wasmbuild@0.14.1/cache.ts';

const loader = new Loader({
  imports,
  cache: cacheToLocalDir,
});
/**
 * Decompression callback
 *
 * @callback DecompressCallback
 * @param {Uint8Array} compressed
 * @return {Uint8Array} decompressed
 */

/**
 * Options for instantiating a Wasm instance.
 * @typedef {Object} InstantiateOptions
 * @property {URL=} url - Optional url to the Wasm file to instantiate.
 * @property {DecompressCallback=} decompress - Callback to decompress the
 * raw Wasm file bytes before instantiating.
 */

/** Instantiates an instance of the Wasm module returning its functions.
 * @remarks It is safe to call this multiple times and once successfully
 * loaded it will always return a reference to the same object.
 * @param {InstantiateOptions=} opts
 */
export async function instantiate(opts) {
  return (await instantiateWithInstance(opts)).exports;
}

/** Instantiates an instance of the Wasm module along with its exports.
 * @remarks It is safe to call this multiple times and once successfully
 * loaded it will always return a reference to the same object.
 * @param {InstantiateOptions=} opts
 * @returns {Promise<{
 *   instance: WebAssembly.Instance;
 *   exports: { encodeStringKeyPart: typeof encodeStringKeyPart; encodeBooleanKeyPart: typeof encodeBooleanKeyPart; encodeBytesKeyPart: typeof encodeBytesKeyPart; encodeBigIntKeyPart: typeof encodeBigIntKeyPart; encodeNumberKeyPart: typeof encodeNumberKeyPart }
 * }>}
 */
export async function instantiateWithInstance(opts) {
  const { instance } = await loader.load(
    opts?.url ?? new URL('codec_bg.wasm', import.meta.url),
    opts?.decompress,
  );
  wasm = wasm ?? instance.exports;
  cachedInt32Memory0 = cachedInt32Memory0 ?? new Int32Array(wasm.memory.buffer);
  cachedUint8Memory0 = cachedUint8Memory0 ?? new Uint8Array(wasm.memory.buffer);
  return {
    instance,
    exports: getWasmInstanceExports(),
  };
}

function getWasmInstanceExports() {
  return { encodeStringKeyPart, encodeBooleanKeyPart, encodeBytesKeyPart, encodeBigIntKeyPart, encodeNumberKeyPart };
}

/** Gets if the Wasm module has been instantiated. */
export function isInstantiated() {
  return loader.instance != null;
}
