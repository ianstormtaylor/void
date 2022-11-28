import { test, expect as e } from 'vitest'
import { Void, Sketch } from '../src'

// Run in the context of a sketch with fixed seed.
let run = (fn: (sketch: Sketch) => void) => {
  let sketch = Sketch.of({
    construct: () => {},
    container: {} as any,
    el: {} as any,
    hash: '0x0123456789abcdef0123456789abcdef',
  })

  Sketch.exec(sketch, () => fn(sketch))
}

// Fill an array of length `n` with the result of `fn`.
let fill = <T>(length: number, fn: (i: number) => T): T[] => {
  return Array(length).fill(null).map(fn)
}

// Get the mean of a set of `numbers`.
let mean = (...numbers: number[]): number => {
  return numbers.reduce((s, n) => s + n, 0) / numbers.length
}

test('Void.bool', () => {
  run((sketch) => {
    let a = Void.bool('a')
    let b = Void.bool('b')
    let c = Void.bool('c')
    let d = Void.bool('d')
    e(a).toEqual(true)
    e(b).toEqual(true)
    e(c).toEqual(true)
    e(d).toEqual(false)
    e(sketch.traits.a).toEqual(a)
    e(sketch.traits.b).toEqual(b)
    e(sketch.traits.c).toEqual(c)
    e(sketch.traits.d).toEqual(d)
    let a2 = Void.bool('a')
    let b2 = Void.bool('b')
    let c2 = Void.bool('c')
    let d2 = Void.bool('d')
    e(a2).toEqual(a)
    e(b2).toEqual(b)
    e(c2).toEqual(c)
    e(d2).toEqual(d)
  })
})

test('Void.convert', () => {
  e(Void.convert(1, 'px')).toEqual(1)
  // imperial
  e(Void.convert(1, 'pt')).toEqual(96 / 72)
  e(Void.convert(1, 'pc')).toEqual(96 / 6)
  e(Void.convert(1, 'in')).toEqual(96)
  e(Void.convert(1, 'ft')).toEqual(96 * 12)
  e(Void.convert(1, 'yd')).toEqual(96 * 12 * 3)
  // metric
  e(Void.convert(1, 'mm')).toBeCloseTo(3.779)
  e(Void.convert(1, 'cm')).toBeCloseTo(37.795)
  e(Void.convert(1, 'm')).toBeCloseTo(3779.527)
  // to specific units
  e(Void.convert(1, 'in', 'in')).toEqual(1)
  e(Void.convert(1, 'ft', 'in')).toEqual(12)
  e(Void.convert(1, 'cm', 'mm')).toEqual(10)
  e(Void.convert(1, 'in', 'cm')).toEqual(2.54)
  // custom dpi
  e(Void.convert(1, 'in', { dpi: 10 })).toEqual(10)
  // custom precision
  e(Void.convert(1, 'mm', { precision: 0 })).toBeCloseTo(3.779)
  e(Void.convert(1, 'mm', { precision: 1 })).toEqual(3)
  e(Void.convert(1, 'mm', { precision: 1.5 })).toEqual(3)
  e(Void.convert(1, 'mm', { precision: 2 })).toEqual(2)
})

test('Void.draw', () => {
  run((sketch) => {
    let draw = () => {}
    Void.draw(draw)
    e(sketch.draw).toEqual(draw)
  })
})

test.skip('event')

test('Void.float', () => {
  run((sketch) => {
    let a = Void.float('a', 0, 5)
    let b = Void.float('b', 0, 5)
    let c = Void.float('c', 0, 5)
    let d = Void.float('d', 0, 5)
    e(a).toBeCloseTo(0.399)
    e(b).toBeCloseTo(0.582)
    e(c).toBeCloseTo(1.876)
    e(d).toBeCloseTo(3.868)
    e(sketch.traits.a).toEqual(a)
    e(sketch.traits.b).toEqual(b)
    e(sketch.traits.c).toEqual(c)
    e(sketch.traits.d).toEqual(d)
    let a2 = Void.float('a', 5, 10)
    let b2 = Void.float('b', 5, 10)
    let c2 = Void.float('c', 5, 10)
    let d2 = Void.float('d', 5, 10)
    e(a2).toEqual(a)
    e(b2).toEqual(b)
    e(c2).toEqual(c)
    e(d2).toEqual(d)
  })

  run(() => {
    let sample = fill(10000, () => Void.random(0, 5))
    e(mean(...sample)).toBeCloseTo(2.5, 1)
  })
})

test('Void.fork', () => {
  run(() => {
    Void.fork(() => {})
    e(Void.random()).toBeCloseTo(0.572)
  })

  run(() => {
    Void.fork(() => {
      for (let i = 0; i < 99; i++) Void.random()
    })
    e(Void.random()).toBeCloseTo(0.572)
  })
})

test('Void.int', () => {
  run((sketch) => {
    let a = Void.int('a', 0, 5)
    let b = Void.int('b', 0, 5)
    let c = Void.int('c', 0, 5)
    let d = Void.int('d', 0, 5)
    e(a).toEqual(0)
    e(b).toEqual(0)
    e(c).toEqual(2)
    e(d).toEqual(4)
    e(sketch.traits.a).toEqual(a)
    e(sketch.traits.b).toEqual(b)
    e(sketch.traits.c).toEqual(c)
    e(sketch.traits.d).toEqual(d)
    let a2 = Void.int('a', 5, 10)
    let b2 = Void.int('b', 5, 10)
    let c2 = Void.int('c', 5, 10)
    let d2 = Void.int('d', 5, 10)
    e(a2).toEqual(a)
    e(b2).toEqual(b)
    e(c2).toEqual(c)
    e(d2).toEqual(d)
  })

  run(() => {
    let sample = fill(10000, () => Void.random(0, 5))
    e(mean(...sample)).toBeCloseTo(2.5, 1)
  })
})

test.skip('Void.keyboard')

test.skip('Void.layer')

test.skip('Void.pointer')

test('Void.pick', () => {
  run((sketch) => {
    let a = Void.pick('a', [1, 2, 3])
    let b = Void.pick('b', [1, 2, 3])
    let c = Void.pick('c', [1, 2, 3])
    let d = Void.pick('d', [1, 2, 3])
    e(a).toEqual(1)
    e(b).toEqual(1)
    e(c).toEqual(2)
    e(d).toEqual(3)
    e(sketch.traits.a).toEqual('1')
    e(sketch.traits.b).toEqual('1')
    e(sketch.traits.c).toEqual('2')
    e(sketch.traits.d).toEqual('3')
  })
})

test('Void.random', () => {
  run(() => {
    // simple
    e(Void.random()).toBeCloseTo(0.079)
    e(Void.random()).toBeCloseTo(0.116)
    e(Void.random()).toBeCloseTo(0.375)
    // float
    e(Void.random(0, 10)).toBeCloseTo(7.737)
    e(Void.random(0, 10)).toBeCloseTo(5.726)
    e(Void.random(0, 10)).toBeCloseTo(4.933)
    // step
    e(Void.random(0, 10, 0.1)).toEqual(5.6)
    e(Void.random(0, 10, 0.1)).toEqual(6.3)
    e(Void.random(0, 10, 0.1)).toEqual(6.5)
    // int
    e(Void.random(0, 10, 2)).toEqual(4)
    e(Void.random(0, 10, 2)).toEqual(6)
    e(Void.random(0, 10, 2)).toEqual(10)
  })

  run(() => {
    let sample = fill(100000, () => Void.random())
    e(mean(...sample)).toBeCloseTo(0.5, 2)
  })

  run(() => {
    let sample = fill(100000, () => Void.random(0, 10))
    e(mean(...sample)).toBeCloseTo(5, 1)
  })

  run(() => {
    let sample = fill(100000, () => Void.random(0, 10, 0.1))
    e(mean(...sample)).toBeCloseTo(5, 1)
  })

  run(() => {
    let sample = fill(100000, () => Void.random(0, 10, 2))
    e(mean(...sample)).toBeCloseTo(5, 1)
  })
})

test('Void.settings', () => {
  run((sketch) => {
    let s = Void.settings([500, 500, 'px'])
    e(sketch.settings).toEqual(s)
    e(s).toEqual({
      dpi: 96,
      fps: 60,
      frames: Infinity,
      height: 500,
      margin: [0, 0, 0, 0],
      precision: 1,
      units: 'px',
      width: 500,
    })
  })

  run((sketch) => {
    let s = Void.settings([6, 6, 'in'])
    e(sketch.settings).toEqual(s)
    e(s).toEqual({
      dpi: 96,
      fps: 60,
      frames: Infinity,
      height: 6,
      margin: [0, 0, 0, 0],
      precision: 0,
      units: 'in',
      width: 6,
    })
  })

  run((sketch) => {
    let s = Void.settings([20, 20, 'cm'])
    e(sketch.settings).toEqual(s)
    e(s).toEqual({
      dpi: 96,
      fps: 60,
      frames: Infinity,
      height: 20,
      margin: [0, 0, 0, 0],
      precision: 0,
      units: 'cm',
      width: 20,
    })
  })

  run((sketch) => {
    let s = Void.settings({
      dimensions: [100, 100, 'mm'],
      margin: [10, 'mm'],
    })
    e(sketch.settings).toEqual(s)
    e(s).toEqual({
      dpi: 96,
      fps: 60,
      frames: Infinity,
      height: 80,
      margin: [10, 10, 10, 10],
      precision: 0,
      units: 'mm',
      width: 80,
    })
  })

  run((sketch) => {
    let s = Void.settings({
      dimensions: [100, 100, 'mm'],
      units: 'px',
    })
    e(sketch.settings).toEqual(s)
    e(s).toEqual({
      dpi: 96,
      fps: 60,
      frames: Infinity,
      height: 377,
      margin: [0, 0, 0, 0],
      precision: 1,
      units: 'px',
      width: 377,
    })
  })

  run((sketch) => {
    let s = Void.settings({
      dimensions: [6, 6, 'in'],
      margin: [3, 'cm'],
      units: 'mm',
      precision: [1, 'mm'],
    })
    e(sketch.settings).toEqual(s)
    e(s).toEqual({
      dpi: 96,
      fps: 60,
      frames: Infinity,
      height: 92,
      margin: [30, 30, 30, 30],
      precision: 1,
      units: 'mm',
      width: 92,
    })
  })
})
