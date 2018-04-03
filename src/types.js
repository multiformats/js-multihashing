// @flow
import type { Code } from "multihashes/lib/constants"

export interface Hash {
  update(buf: Buffer): Hash;
  digest(): Buffer;
}

export type HashBuilder = () => Hash
export type HashTable = { [Code]: HashBuilder }
