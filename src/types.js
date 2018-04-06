// @flow
import type { Code } from 'multihashes/lib/constants'

// We break up the Hash Class into Hash and HashUpdate
// this is a really nice use of types to avoid the user
// calling digest on the hash class before doing an update
// and adding an input. This works by only returning an interface
// that supports update. Once update is called a full hash interface with
// the digest function exposed is available.
// This will only work for a code also using flow.

/* eslint-disable no-use-before-define */
export interface HashUpdate {
  update(buf: Buffer): Hash;
}

export interface Hash extends HashUpdate {
  digest(): Buffer;
}
/* eslint-enable no-use-before-define */

export type HashBuilder = () => HashUpdate
export type HashTable = { [Code]: HashBuilder }
