// @flow

import * as multihash from 'multihashes'
import type { Multihash } from 'multihashes'
import type { Name, Code } from 'multihashes/lib/constants'
import type { HashUpdate, HashTable } from './types'
import * as blake from './blake'
import * as sha3 from './sha3'
import * as crypto from 'webcrypto'

const mh = Multihashing
export default mh

mh.Buffer = Buffer // for browser things

function Multihashing (
  buf: Buffer,
  func: Name | Code,
  length: number
): Multihash {
  return multihash.encode(mh.digest(buf, func, length), func, length)
}

// expose multihash itself, to avoid silly double requires.
mh.multihash = multihash

mh.digest = function (buf: Buffer, func: Name | Code, length: ?number): Buffer {
  let digest = mh
    .createHash(func)
    .update(buf)
    .digest()

  if (length) {
    digest = digest.slice(0, length)
  }

  return digest
}

mh.createHash = function (func: Name | Code): HashUpdate {
  func = multihash.coerceCode(func)
  if (!mh.functions[func]) {
    throw new Error('multihash function ' + func + ' not yet supported')
  }

  return mh.functions[func]()
}

mh.verify = function verify (hash: Multihash, buf: Buffer): boolean {
  const decoded = multihash.decode(hash)
  const encoded = mh(buf, decoded.name, decoded.length)
  return encoded.equals(hash)
}

/* eslint-disable no-useless-computed-key */
mh.functions = ({
  [0x11]: gsha1,
  [0x12]: gsha2256,
  [0x13]: gsha2512
}: HashTable)
/* eslint-enable no-useless-computed-key */

blake.addFuncs(mh.functions)
sha3.addFuncs(mh.functions)

function gsha1 (): HashUpdate {
  return crypto.createHash('sha1')
}

function gsha2256 (): HashUpdate {
  return crypto.createHash('sha256')
}

function gsha2512 (): HashUpdate {
  return crypto.createHash('sha512')
}
