/* eslint-env mocha */
'use strict'

const expect = require('chai').expect
const multihashing = require('../src')

describe('multihashing', () => {
  it('sha1', () => {
    const buf = Buffer.from('beep boop')

    expect(
      multihashing(buf, 'sha1')
    ).to.be.eql(
      Buffer.from('11147c8357577f51d4f0a8d393aa1aaafb28863d9421', 'hex')
    )
  })

  it('sha2-256', () => {
    const buf = Buffer.from('beep boop')

    expect(
      multihashing(buf, 'sha2-256')
    ).to.be.eql(
      Buffer.from('122090ea688e275d580567325032492b597bc77221c62493e76330b85ddda191ef7c', 'hex')
    )
  })

  it('sha2-512', () => {
    const buf = Buffer.from('beep boop')

    expect(
      multihashing(buf, 'sha2-512')
    ).to.be.eql(
      Buffer.from('134014f301f31be243f34c5668937883771fa381002f1aaa5f31b3f78e500b66ff2f4f8ea5e3c9f5a61bd073e2452c480484b02e030fb239315a2577f7ae156af177', 'hex')
    )
  })

  it('blake2b', () => {
    const buf = Buffer.from('beep boop')

    expect(
      multihashing(buf, 'blake2b-512')
    ).to.be.eql(
      Buffer.from('c0e402400eac6255ba822373a0948122b8d295008419a8ab27842ee0d70eca39855621463c03ec75ac3610aacfdff89fa989d8d61fc00450148f289eb5b12ad1a954f659', 'hex')
    )
    expect(
      multihashing(buf, 'blake2b-160')
    ).to.be.eql(
      Buffer.from('94e40214fe303247293e54e0a7ea48f9408ca68b36b08442', 'hex')
    )
  })

  it('blake2s', () => {
    const buf = Buffer.from('beep boop')

    expect(
      multihashing(buf, 'blake2s-256')
    ).to.be.eql(
      Buffer.from('e0e402204542eaca484e4311def8af74b546edd7fceb49eeb3cdcfd8a4a72ed0dc81d4c0', 'hex')
    )
    expect(
      multihashing(buf, 'blake2s-40')
    ).to.be.eql(
      Buffer.from('c5e402059ada01bb57', 'hex')
    )
  })

  it('cuts the length', () => {
    const buf = Buffer.from('beep boop')

    expect(
      multihashing(buf, 'sha2-256', 10)
    ).to.be.eql(
      Buffer.from('120a90ea688e275d58056732', 'hex')
    )
  })

  it('throws on non implemented func', () => {
    expect(
      () => multihashing(Buffer.from('beep boop'), 'sha3')
    ).to.throw(
      /Unrecognized hash function named:/
    )
  })
})
