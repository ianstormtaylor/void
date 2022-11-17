import { test, expect as e } from 'vitest'
import { Void, Sketch } from '../src'

// Run in the context of a sketch with fixed seed.
let run = (fn: (sketch: Sketch) => void) => {
  let sketch = Sketch.of({
    construct: () => {},
    container: {} as any,
    el: {} as any,
    hash: '0x1',
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
    e(a).toEqual(true)
    e(b).toEqual(false)
    e(c).toEqual(true)
    e(sketch.traits.a).toEqual(a)
    e(sketch.traits.b).toEqual(b)
    e(sketch.traits.c).toEqual(c)
    let a2 = Void.bool('a')
    let b2 = Void.bool('b')
    let c2 = Void.bool('c')
    e(a2).toEqual(a)
    e(b2).toEqual(b)
    e(c2).toEqual(c)
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
  e(Void.convert(1, 'mm', { precision: 0 })).toEqual(4)
  e(Void.convert(1, 'mm', { precision: 1 })).toBeCloseTo(3.8)
  e(Void.convert(1, 'mm', { precision: 3 })).toBeCloseTo(3.78)
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
    e(a).toBeCloseTo(0.524)
    e(b).toBeCloseTo(4.596)
    e(c).toBeCloseTo(1.17)
    e(sketch.traits.a).toEqual(a)
    e(sketch.traits.b).toEqual(b)
    e(sketch.traits.c).toEqual(c)
    let a2 = Void.float('a', 5, 10)
    let b2 = Void.float('b', 5, 10)
    let c2 = Void.float('c', 5, 10)
    e(a2).toEqual(a)
    e(b2).toEqual(b)
    e(c2).toEqual(c)
  })
})

test('Void.int', () => {
  run((sketch) => {
    let a = Void.int('a', 0, 5)
    let b = Void.int('b', 0, 5)
    let c = Void.int('c', 0, 5)
    e(a).toEqual(1)
    e(b).toEqual(5)
    e(c).toEqual(2)
    e(sketch.traits.a).toEqual(a)
    e(sketch.traits.b).toEqual(b)
    e(sketch.traits.c).toEqual(c)
    let a2 = Void.int('a', 5, 10)
    let b2 = Void.int('b', 5, 10)
    let c2 = Void.int('c', 5, 10)
    e(a2).toEqual(a)
    e(b2).toEqual(b)
    e(c2).toEqual(c)
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
    e(a).toEqual(1)
    e(b).toEqual(3)
    e(c).toEqual(1)
    e(sketch.traits.a).toEqual('1')
    e(sketch.traits.b).toEqual('3')
    e(sketch.traits.c).toEqual('1')
  })
})

test('Void.random', () => {
  run(() => {
    // simple
    e(Void.random()).toBeCloseTo(0.104)
    e(Void.random()).toBeCloseTo(0.919)
    e(Void.random()).toBeCloseTo(0.234)
    // float
    e(Void.random(0, 10)).toBeCloseTo(4.608)
    e(Void.random(0, 10)).toBeCloseTo(9.657)
    e(Void.random(0, 10)).toBeCloseTo(0.285)
    // step
    e(Void.random(0, 10, 0.1)).toBeCloseTo(7.3, 10)
    e(Void.random(0, 10, 0.1)).toBeCloseTo(5.1, 10)
    e(Void.random(0, 10, 0.1)).toBeCloseTo(6.8, 10)
    // int
    e(Void.random(0, 10, 2)).toEqual(0)
    e(Void.random(0, 10, 2)).toEqual(2)
    e(Void.random(0, 10, 2)).toEqual(0)
  })

  run(() => {
    let sample = fill(3000, () => Void.random())
    e(mean(...sample)).toBeCloseTo(0.5)
  })

  run(() => {
    let sample = fill(3000, () => Void.random(0, 10))
    e(mean(...sample)).toBeCloseTo(5, 1)
  })

  run(() => {
    let sample = fill(3000, () => Void.random(0, 10, 0.1))
    e(mean(...sample)).toBeCloseTo(5, 1)
  })

  run(() => {
    let sample = fill(3000, () => Void.random(0, 10, 2))
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
      precision: 0,
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
      precision: null,
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
      precision: null,
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
      precision: null,
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
      height: 378,
      margin: [0, 0, 0, 0],
      precision: 0,
      units: 'px',
      width: 378,
    })
  })

  run((sketch) => {
    let s = Void.settings({
      dimensions: [6, 6, 'in'],
      margin: [3, 'cm'],
      units: 'mm',
      precision: 1,
    })
    e(sketch.settings).toEqual(s)
    e(s).toEqual({
      dpi: 96,
      fps: 60,
      frames: Infinity,
      height: 92.4,
      margin: [30, 30, 30, 30],
      precision: 1,
      units: 'mm',
      width: 92.4,
    })
  })
})
