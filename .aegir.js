'use strict'

module.exports = {
  bundlesize: { maxSize: '460kB' },
  webpack: {
    node: {
      Buffer: true,
      crypto: true,
      stream: true
    }
  }
}
