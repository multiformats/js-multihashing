// @flow
"use strict"

import * as multihash from "multihashes"
import type { Multihash } from "multihashes"
import type { Name, Code } from "multihashes/lib/constants"
import type { HashTable, Hash } from "./types"
import * as blake from "./blake"
import * as sha3 from "./sha3"
import * as crypto from "webcrypto"

const mh = (module.exports = Multihashing)

mh.Buffer = Buffer // for browser things

function Multihashing(
  buf: Buffer,
  func: Name | Code,
  length: number
): Multihash {
  return multihash.encode(mh.digest(buf, func, length), func, length)
}

// expose multihash itself, to avoid silly double requires.
mh.multihash = multihash

mh.digest = function(buf: Buffer, func: Name | Code, length: ?number): Buffer {
  let digest = mh
    .createHash(func)
    .update(buf)
    .digest()

  if (length) {
    digest = digest.slice(0, length)
  }

  return digest
}

mh.createHash = function(func: Name | Code): Hash {
  func = multihash.coerceCode(func)
  if (!mh.functions[func]) {
    throw new Error("multihash function " + func + " not yet supported")
  }

  return mh.functions[func]()
}

mh.verify = function verify(hash: Multihash, buf: Buffer): boolean {
  const decoded = multihash.decode(hash)
  const encoded = mh(buf, decoded.name, decoded.length)
  return encoded.equals(hash)
}

mh.functions = {
  [0x11]: gsha1,
  [0x12]: gsha2256,
  [0x13]: gsha2512
}

blake.addFuncs(mh.functions)
sha3.addFuncs(mh.functions)

function gsha1(): Hash {
  return crypto.createHash("sha1")
}

function gsha2256(): Hash {
  return crypto.createHash("sha256")
}

function gsha2512(): Hash {
  return crypto.createHash("sha512")
}
