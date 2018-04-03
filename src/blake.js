// @flow
"use strict"

import * as blake from "blakejs"
import type { Hash, HashTable, HashBuilder } from "./types"
import type { Code } from "multihashes/lib/constants"

const minB: Code = 0xb201
const minS: Code = 0xb241

type BlakeCtx = {
  b: Uint8Array,
  h: Uint32Array,
  t: number,
  c: number,
  outlen: number
}
type Blake2Hash = Buffer
type BlakeHasher = {
  init(size: number, key: ?number): BlakeCtx,
  update(ctx: BlakeCtx, input: Uint8Array): void,
  digest(ctx: BlakeCtx): Uint8Array
}

const blake2b: BlakeHasher = {
  init: blake.blake2bInit,
  update: blake.blake2bUpdate,
  digest: blake.blake2bFinal
}

blake2b.init(1, 1)

const blake2s: BlakeHasher = {
  init: blake.blake2sInit,
  update: blake.blake2sUpdate,
  digest: blake.blake2sFinal
}

class B2Hash implements Hash {
  ctx: BlakeCtx | null
  hf: BlakeHasher

  constructor(size, hashFunc) {
    this.hf = hashFunc
    this.ctx = this.hf.init(size, null)
  }

  update(buf: Buffer): Hash {
    if (this.ctx === null) {
      throw new Error("blake2 context is null. (already called digest?)")
    }
    this.hf.update(this.ctx, buf)
    return this
  }

  digest(): Blake2Hash {
    const ctx = this.ctx
    this.ctx = null
    if (ctx === null) {
      throw Error("blake2 context is null. (already called digest?)")
    }
    return Buffer.from(this.hf.digest(ctx))
  }
}

export const addFuncs = (table: HashTable) => {
  const mkFunc = (size: number, hashFunc: BlakeHasher): HashBuilder => {
    return (): Hash => new B2Hash(size, hashFunc)
  }

  // I don't like using any here but the only way I could get the types to work here.
  let i
  for (i = 0; i < 64; i++) {
    table[(minB + i: any)] = mkFunc(i + 1, blake2b)
  }
  for (i = 0; i < 32; i++) {
    table[(minS + i: any)] = mkFunc(i + 1, blake2s)
  }
}
