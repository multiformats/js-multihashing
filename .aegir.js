'use strict'

module.exports = {
  bundlesize: { maxSize: '193kB' },
  webpack: {
    node: {
      Buffer: true,
      crypto: true,
      stream: true
    }
  }
}
