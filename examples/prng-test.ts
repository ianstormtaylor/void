import { Void, Math } from 'void'

export default function () {
  let size = Void.int('size', 600, 600)
  let { width, height, seed } = Void.settings([size, size, 'px'])
  let layer = Void.layer()
  let cell = 1

  let prng = Void.pick('prng', {
    'Crypto': createCrypto(seed),
    'P5.js': createP5(seed),
    'LCG': createLcg(seed),
    'Mersenne': createMersenne(seed),
    'Xorshift': createXorshift(seed),
    'PCG': createPcg(seed),
  })

  let test = Void.pick('test', {
    'chance': (x: number) => x < 0.5,
    'mod 2': (x: number) => Math.trunc(x * 2 ** 32) % 2 === 0,
  })

  for (let x of Math.range(0, width, cell)) {
    for (let y of Math.range(0, height, cell)) {
      let r = prng()
      layer.fillStyle = test(r) ? 'black' : 'white'
      layer.fillRect(x, y, cell, cell)
    }
  }
}

// https://stackoverflow.com/questions/15821447/converting-random-bytes-to-an-integer-range-how
function createCrypto(seed: number) {
  return () => {
    return window.crypto.getRandomValues(new Uint32Array(1))[0] / 0x100000000
  }
}

function createP5(seed: number) {
  let M = 2 ** 32
  let A = 1664525
  let C = 1013904223
  seed = seed >>> 0
  return () => {
    seed = (A * seed + C) % M
    return seed / M
  }
}

function createLcg(seed: number) {
  let M = 2 ** 31 - 1
  let A = 48271
  seed = Math.abs(seed)
  return () => {
    seed = (A * seed) % M
    return seed / M
  }
}

function createMersenne(seed: number) {
  let N = 624
  let M = 397
  let MATRIX_A = 0x9908b0df
  let UPPER_MASK = 0x80000000
  let LOWER_MASK = 0x7fffffff
  let mt = new Array(N)
  let mti = N + 1
  init_seed(seed)
  return random
  function init_seed(s: number) {
    mt[0] = s >>> 0
    for (mti = 1; mti < N; mti++) {
      let s = mt[mti - 1] ^ (mt[mti - 1] >>> 30)
      mt[mti] =
        ((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
        (s & 0x0000ffff) * 1812433253 +
        mti
      mt[mti] >>>= 0
    }
  }
  function random_int(): number {
    let y
    let mag01 = new Array(0x0, MATRIX_A)
    if (mti >= N) {
      let kk
      if (mti == N + 1) init_seed(5489)
      for (kk = 0; kk < N - M; kk++) {
        y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK)
        mt[kk] = mt[kk + M] ^ (y >>> 1) ^ mag01[y & 0x1]
      }
      for (; kk < N - 1; kk++) {
        y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK)
        mt[kk] = mt[kk + (M - N)] ^ (y >>> 1) ^ mag01[y & 0x1]
      }
      y = (mt[N - 1] & UPPER_MASK) | (mt[0] & LOWER_MASK)
      mt[N - 1] = mt[M - 1] ^ (y >>> 1) ^ mag01[y & 0x1]
      mti = 0
    }
    y = mt[mti++]
    y ^= y >>> 11
    y ^= (y << 7) & 0x9d2c5680
    y ^= (y << 15) & 0xefc60000
    y ^= y >>> 18
    return y >>> 0
  }
  function random(): number {
    return random_int() * (1.0 / 4294967296.0)
  }
}

function createXorshift(s: number) {
  let seed = [s, s, s, s]
  let _state0U = seed[0] | 0
  let _state0L = seed[1] | 0
  let _state1U = seed[2] | 0
  let _state1L = seed[3] | 0
  return random
  function randomint() {
    var s1U = _state0U,
      s1L = _state0L
    var s0U = _state1U,
      s0L = _state1L
    var sumL = (s0L >>> 0) + (s1L >>> 0)
    var resU = (s0U + s1U + ((sumL / 2) >>> 31)) >>> 0
    var resL = sumL >>> 0
    _state0U = s0U
    _state0L = s0L
    var t1U = 0,
      t1L = 0
    var t2U = 0,
      t2L = 0
    var a1 = 23
    var m1 = 0xffffffff << (32 - a1)
    t1U = (s1U << a1) | ((s1L & m1) >>> (32 - a1))
    t1L = s1L << a1
    s1U = s1U ^ t1U
    s1L = s1L ^ t1L
    t1U = s1U ^ s0U
    t1L = s1L ^ s0L
    var a2 = 18
    var m2 = 0xffffffff >>> (32 - a2)
    t2U = s1U >>> a2
    t2L = (s1L >>> a2) | ((s1U & m2) << (32 - a2))
    t1U = t1U ^ t2U
    t1L = t1L ^ t2L
    var a3 = 5
    var m3 = 0xffffffff >>> (32 - a3)
    t2U = s0U >>> a3
    t2L = (s0L >>> a3) | ((s0U & m3) << (32 - a3))
    t1U = t1U ^ t2U
    t1L = t1L ^ t2L
    _state1U = t1U
    _state1L = t1L
    return [resU, resL]
  }
  function random() {
    var t2 = randomint()
    return (
      t2[0] * 2.3283064365386963e-10 + (t2[1] >>> 12) * 2.220446049250313e-16
    )
  }
}

function createPcg(seed: number) {
  let DEFAULT_INC_LO = 0xf767814f
  let DEFAULT_INC_HI = 0x14057b7e
  let MUL_HI = 0x5851f42d
  let MUL_LO = 0x4c957f2d
  let BIT_53 = 9007199254740992.0
  let BIT_27 = 134217728.0
  let _state = new Uint32Array(4)
  _state[2] = DEFAULT_INC_LO | 1
  _state[3] = DEFAULT_INC_HI
  setSeed(seed, 0)
  return number
  function setSeed(seedLo, seedHi) {
    let sl32 = seedLo >>> 0
    let sh32 = seedHi >>> 0
    _state[0] = 0
    _state[1] = 0
    next32()
    add64_(_state[0], _state[1], sl32 >>> 0, sh32 >>> 0, _state)
    next32()
  }
  function add64_(aLo, aHi, bLo, bHi, out) {
    var aL = aLo >>> 0,
      aH = aHi >>> 0
    var bL = bLo >>> 0,
      bH = bHi >>> 0
    var aHpbH = (aH + bH) >>> 0
    var lo = (aL + bL) >>> 0
    var carry = Number(lo < aL) >>> 0
    var hi = (aHpbH + carry) >>> 0
    out[0] = lo
    out[1] = hi
  }
  function mul64_(aLo, aHi, bLo, bHi, out) {
    var aL = aLo >>> 0,
      aH = aHi >>> 0
    var bL = bLo >>> 0,
      bH = bHi >>> 0
    var aLH = (aL >>> 16) & 0xffff,
      aLL = aL & 0xffff
    var bLH = (bL >>> 16) & 0xffff,
      bLL = bL & 0xffff
    var aLHxbLL = (aLH * bLL) >>> 0,
      aLLxbLH = (aLL * bLH) >>> 0
    var aLHxbLH = (aLH * bLH) >>> 0,
      aLLxbLL = (aLL * bLL) >>> 0
    var aLHxbLL0 = aLHxbLL >>> 16,
      aLHxbLL1 = (aLHxbLL << 16) >>> 0
    var aLLxbLH0 = aLLxbLH >>> 16,
      aLLxbLH1 = (aLLxbLH << 16) >>> 0
    var l0 = (aLHxbLL1 + aLLxbLH1) >>> 0
    var c0 = Number(l0 >>> 0 < aLHxbLL1 >>> 0) | 0
    var h0 = (((aLHxbLL0 + aLLxbLH0) >>> 0) + c0) >>> 0
    var aLxbH = Math.imul(aL, bH) >>> 0
    var aHxbL = Math.imul(aH, bL) >>> 0
    var resLo = (l0 + aLLxbLL) >>> 0
    var c1 = Number(resLo >>> 0 < aLLxbLL >>> 0) | 0
    var h1 = (((aLHxbLH + h0) >>> 0) + c1) >>> 0
    var resHi = (((aLxbH + aHxbL) >>> 0) + h1) >>> 0
    out[0] = resLo
    out[1] = resHi
  }
  function next32() {
    var state = _state
    var oldLo = state[0] >>> 0
    var oldHi = state[1] >>> 0
    mul64_(oldLo, oldHi, MUL_LO, MUL_HI, state)
    add64_(state[0], state[1], state[2], state[3], state)
    var xsHi = oldHi >>> 18
    var xsLo = ((oldLo >>> 18) | (oldHi << 14)) >>> 0
    xsHi = (xsHi ^ oldHi) >>> 0
    xsLo = (xsLo ^ oldLo) >>> 0
    var xorshifted = ((xsLo >>> 27) | (xsHi << 5)) >>> 0
    var rot = oldHi >>> 27
    var rot2 = ((-rot >>> 0) & 31) >>> 0
    return ((xorshifted >>> rot) | (xorshifted << rot2)) >>> 0
  }
  function number() {
    let hi = (next32() & 0x03ffffff) * 1.0
    let lo = (next32() & 0x07ffffff) * 1.0
    return (hi * BIT_27 + lo) / BIT_53
  }
}
