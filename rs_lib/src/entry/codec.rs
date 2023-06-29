// Ported from https://github.com/denoland/deno/blob/d82b5f3beca588d050784ff191aae5698ff5c61e/ext/kv/codec.rs

use num_bigint::BigInt;
use wasm_bindgen::prelude::*;

const BYTES: u8 = 0x01;
const STRING: u8 = 0x02;
const NEGINTSTART: u8 = 0x0b;
const INTZERO: u8 = 0x14;
const POSINTEND: u8 = 0x1d;
const DOUBLE: u8 = 0x21;
const FALSE: u8 = 0x26;
const TRUE: u8 = 0x27;
const ESCAPE: u8 = 0xff;

const CANONICAL_NAN_POS: u64 = 0x7ff8000000000000u64;
const CANONICAL_NAN_NEG: u64 = 0xfff8000000000000u64;

#[wasm_bindgen(js_name = encodeStringKeyPart)]
pub fn encode_string_key_part(key_part: String) -> Vec<u8> {
  let mut output: Vec<u8> = vec![];

  output.push(STRING);
  escape_raw_bytes_into(&mut output, key_part.as_bytes());
  output.push(0);

  return output;
}

#[wasm_bindgen(js_name = encodeBooleanKeyPart)]
pub fn encode_boolean_key_part(key_part: bool) -> Vec<u8> {
  let mut output: Vec<u8> = vec![];

  if key_part == true {
    output.push(TRUE);
  } else {
    output.push(FALSE);
  }

  return output;
}

#[wasm_bindgen(js_name = encodeBytesKeyPart)]
pub fn encode_bytes_key_part(key_part: &[u8]) -> Vec<u8> {
  let mut output: Vec<u8> = vec![];

  output.push(BYTES);
  escape_raw_bytes_into(&mut output, key_part);
  output.push(0);

  return output;
}

#[wasm_bindgen(js_name = encodeBigIntKeyPart)]
pub fn encode_big_int_key_part(key_part: u64) -> Vec<u8> {
  let mut output: Vec<u8> = vec![];
  bigint::encode_into(&mut output, &BigInt::from(key_part));
  return output;
}

#[wasm_bindgen(js_name = encodeNumberKeyPart)]
pub fn encode_number_key_part(key_part: f64) -> Vec<u8> {
  let mut output: Vec<u8> = vec![];
  double::encode_into(&mut output, key_part);
  return output;
}

pub fn canonicalize_f64(n: f64) -> f64 {
  if n.is_nan() {
    if n.is_sign_negative() {
      f64::from_bits(CANONICAL_NAN_NEG)
    } else {
      f64::from_bits(CANONICAL_NAN_POS)
    }
  } else {
    n
  }
}

fn escape_raw_bytes_into(out: &mut Vec<u8>, x: &[u8]) {
  for &b in x {
    out.push(b);
    if b == 0 {
      out.push(ESCAPE);
    }
  }
}

mod bigint {
  use std::io::Error;
  use wasm_bindgen::UnwrapThrowExt;
  use num_bigint::BigInt;
  use num_bigint::Sign as BigIntSign;

  const MAX_SZ: usize = 8;

  // Ported from https://github.com/foundationdb-rs/foundationdb-rs/blob/7415e116d5d96c2630976058de28e439eed7e809/foundationdb/src/tuple/pack.rs#L575
  pub fn encode_into(out: &mut Vec<u8>, key: &BigInt) {
    if key.sign() == BigIntSign::NoSign {
      out.push(super::INTZERO);
      return;
    }

    let (sign, mut bytes) = key.to_bytes_be();
    let n = bytes.len();
    match sign {
      BigIntSign::Minus => {
        if n <= MAX_SZ {
          out.push(super::INTZERO - n as u8);
        } else {
          out.extend_from_slice(&[super::NEGINTSTART, bigint_n(n) ^ 0xff]);
        }
        invert(&mut bytes);
        out.extend_from_slice(&bytes);
      }
      BigIntSign::NoSign => unreachable!(),
      BigIntSign::Plus => {
        if n <= MAX_SZ {
          out.push(super::INTZERO + n as u8);
        } else {
          out.extend_from_slice(&[super::POSINTEND, bigint_n(n)]);
        }
        out.extend_from_slice(&bytes);
      }
    }
  }

  fn invert(bytes: &mut [u8]) {
    // The ones' complement of a binary number is defined as the value
    // obtained by inverting all the bits in the binary representation
    // of the number (swapping 0s for 1s and vice versa).
    for byte in bytes.iter_mut() {
      *byte = !*byte;
    }
  }

  fn bigint_n(n: usize) -> u8 {
    let result: Result<u8, Error> = u8::try_from(n).map_err(|_| {
      std::io::Error::new(
        std::io::ErrorKind::InvalidInput,
        "BigUint requires more than 255 bytes to be represented",
      )
    });

    return result.unwrap_throw();
  }
}

mod double {
  macro_rules! sign_bit {
    ($type:ident) => {
      (1 << (std::mem::size_of::<$type>() * 8 - 1))
    };
  }

  fn f64_to_ux_be_bytes(f: f64) -> [u8; 8] {
    let u = if f.is_sign_negative() {
      f.to_bits() ^ ::std::u64::MAX
    } else {
      f.to_bits() ^ sign_bit!(u64)
    };
    u.to_be_bytes()
  }

  pub fn encode_into(out: &mut Vec<u8>, x: f64) {
    out.push(super::DOUBLE);
    out.extend_from_slice(&f64_to_ux_be_bytes(super::canonicalize_f64(x)));
  }
}
