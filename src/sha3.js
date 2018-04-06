// @flow
import * as sha3 from 'js-sha3'
import type { Hash, HashTable, HashUpdate } from './types'

const functions = [
  [0x14, sha3.sha3_512],
  [0x15, sha3.sha3_384],
  [0x16, sha3.sha3_256],
  [0x17, sha3.sha3_224],
  [0x18, sha3.shake128, 256],
  [0x19, sha3.shake256, 512],
  [0x1a, sha3.keccak224],
  [0x1b, sha3.keccak256],
  [0x1c, sha3.keccak384],
  [0x1d, sha3.keccak512]
]

type HexString = string
type Sha3Hash = Buffer
type ShaHasher = (input: string | Buffer, length?: number) => HexString

class ShaHash implements Hash {
  hf: ShaHasher
  input: Buffer | null
  arg: number

  constructor (hashFunc, arg?: number) {
    this.hf = hashFunc
    if (arg) {
      this.arg = arg
    }
    this.input = null
  }

  static new (hashFunc, arg?: number): HashUpdate {
    return new ShaHash(hashFunc, arg)
  }

  update (buf: Buffer): Hash {
    this.input = buf
    return this
  }

  digest (): Sha3Hash {
    if (!this.input) {
      throw Error('Missing an input to hash')
    }
    const input = this.input
    const arg = this.arg
    return Buffer.from(this.hf(input, arg), 'hex')
  }
}

export const addFuncs = (table: HashTable) => {
  for (const info of functions) {
    const code = info[0]
    const fn = info[1]

    if (info.length === 3) {
      table[code] = () => ShaHash.new(fn, info[2])
    } else {
      table[code] = () => ShaHash.new(fn)
    }
  }
}
