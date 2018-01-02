'use strict'

const sha3 = require('js-sha3')

const functions = {
  0x14: sha3.sha3_512,
  0x15: sha3.sha3_384,
  0x16: sha3.sha3_256,
  0x17: sha3.sha3_224,
  0x18: sha3.shake128,
  0x19: sha3.shake256,
  0x1A: sha3.keccak224,
  0x1B: sha3.keccak256,
  0x1C: sha3.keccak384,
  0x1D: sha3.keccak512
}

class Hasher {
  constructor (hashFunc) {
    this.hf = hashFunc
    this.input = null
  }

  update (buf) {
    this.input = buf
    return this
  }

  digest () {
    const input = this.input
    return Buffer.from(this.hf(input), 'hex')
  }
}

function addFuncs (table) {
  for (const code in functions) {
    if (functions.hasOwnProperty(code)) {
      table[code] = () => new Hasher(functions[code])
    }
  }
}

module.exports = {
  addFuncs: addFuncs
}
