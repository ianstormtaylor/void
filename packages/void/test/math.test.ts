import { expect as e, test as t } from 'vitest'
import { Math } from '../src'

// Some floating point math that gets near zero but not quite.
let NEAR_ZERO = 0.1 + 0.2 - 0.3

t('Math.PHI', () => {
  e(Math.PHI).toEqual((1 + Math.sqrt(5)) / 2)
})

t('Math.TAU', () => {
  e(Math.TAU).toEqual(Math.PI * 2)
})

t('Math.TOLERANCE', () => {
  e(Math.TOLERANCE).toEqual(0.000001)
})

t('Math.array', () => {
  e(Math.array(0)).toEqual([])
  e(Math.array(1)).toEqual([0])
  e(Math.array(2)).toEqual([0, 1])
  e(Math.array(3, (i) => i * 2)).toEqual([0, 2, 4])
})

t('Math.between', () => {
  e(Math.between(1, 0, 2)).toEqual(true)
  e(Math.between(0, 1, 2)).toEqual(false)
  e(Math.between(NEAR_ZERO, 0, 2)).toEqual(false)
})

t('Math.bins', () => {
  e(Array.from(Math.bins(0, 4, 0))).toEqual([])
  e(Array.from(Math.bins(0, 4, 1))).toEqual([[0, 4]])
  e(Array.from(Math.bins(0, 4, 2))).toEqual([
    [0, 2],
    [2, 4],
  ])
  e(Array.from(Math.bins(0, 4, 3))).toEqual([
    [0, 1 + 1 / 3],
    [1 + 1 / 3, 2 + 2 / 3],
    [2 + 2 / 3, 4],
  ])
})

t('Math.bounce', () => {
  e(Math.bounce(-7, 0, 3)).toEqual(1)
  e(Math.bounce(-5, 0, 3)).toEqual(1)
  e(Math.bounce(-3, 0, 3)).toEqual(3)
  e(Math.bounce(-1, 0, 3)).toEqual(1)
  e(Math.bounce(0, 0, 3)).toEqual(0)
  e(Math.bounce(1, 0, 3)).toEqual(1)
  e(Math.bounce(3, 0, 3)).toEqual(3)
  e(Math.bounce(5, 0, 3)).toEqual(1)
  e(Math.bounce(7, 0, 3)).toEqual(1)

  e(Math.bounce(-5, -2, 2)).toEqual(1)
  e(Math.bounce(-3, -2, 2)).toEqual(-1)
  e(Math.bounce(-1, -2, 2)).toEqual(-1)
  e(Math.bounce(0, -2, 2)).toEqual(0)
  e(Math.bounce(1, -2, 2)).toEqual(1)
  e(Math.bounce(3, -2, 2)).toEqual(1)
  e(Math.bounce(5, -2, 2)).toEqual(-1)
})

t('Math.ceilTo', () => {
  e(Math.ceilTo(Math.PI, 2)).toEqual(3.15)
  e(Math.ceilTo(Math.PI, 4)).toEqual(3.1416)
  e(Math.ceilTo(Math.PI, { multiple: 0.2 })).toEqual(3.2)
  e(Math.ceilTo(Math.PI, { multiple: 0.5 })).toEqual(3.5)
  e(Math.ceilTo(4.34201, { multiple: 0.01 })).toBeCloseTo(4.35, Math.TOLERANCE)
})

t('Math.clamp', () => {
  e(Math.clamp(-1.3, 0, 1)).toEqual(0)
  e(Math.clamp(0.4, 0, 1)).toEqual(0.4)
  e(Math.clamp(1.2, 0, 1)).toEqual(1)
})

t('Math.combinations', () => {
  e(Math.combinations([1, 2, 3])).toEqual([
    [1],
    [2],
    [3],
    [1, 2],
    [1, 3],
    [2, 3],
    [1, 2, 3],
  ])
  e(Math.combinations([1, 2, 3], 2)).toEqual([
    [1, 2],
    [1, 3],
    [2, 3],
  ])
  e(Math.combinations([1, 2, 3], 1, 2)).toEqual([
    [1],
    [2],
    [3],
    [1, 2],
    [1, 3],
    [2, 3],
  ])
})

t('Math.copySign', () => {
  e(Math.copySign(2, 1)).toEqual(2)
  e(Math.copySign(2, -1)).toEqual(-2)
  e(Math.copySign(-2, 1)).toEqual(2)
  e(Math.copySign(-2, -1)).toEqual(-2)
  e(Math.copySign(2, 0)).toEqual(2)
  e(Math.copySign(2, -0)).toEqual(-2)
  e(Math.copySign(-2, 0)).toEqual(2)
  e(Math.copySign(-2, -0)).toEqual(-2)
})

t('Math.degrees', () => {
  e(Math.degrees(0)).toEqual(0)
  e(Math.degrees(Math.PI / 2)).toEqual(90)
  e(Math.degrees(Math.PI)).toEqual(180)
  e(Math.degrees((Math.PI * 3) / 2)).toEqual(270)
  e(Math.degrees(Math.TAU)).toEqual(360)
})

t('Math.easeIn', () => {
  e(Math.easeIn(0)).toEqual(0)
  e(Math.easeIn(0.25)).toEqual(0.0625)
  e(Math.easeIn(0.5)).toEqual(0.25)
  e(Math.easeIn(0.75)).toEqual(0.5625)
  e(Math.easeIn(1)).toEqual(1)
  e(Math.easeIn(0.25, 3)).toEqual(0.015625)
})

t('Math.easeInOut', () => {
  e(Math.easeInOut(0)).toEqual(0)
  e(Math.easeInOut(0.25)).toEqual(0.125)
  e(Math.easeInOut(0.5)).toEqual(0.5)
  e(Math.easeInOut(0.75)).toEqual(0.875)
  e(Math.easeInOut(1)).toEqual(1)
  e(Math.easeInOut(0.25, 3)).toEqual(0.0625)
})

t('Math.easeOut', () => {
  e(Math.easeOut(0)).toEqual(0)
  e(Math.easeOut(0.25)).toEqual(0.4375)
  e(Math.easeOut(0.5)).toEqual(0.75)
  e(Math.easeOut(0.75)).toEqual(0.9375)
  e(Math.easeOut(1)).toEqual(1)
  e(Math.easeOut(0.25, 3)).toEqual(0.578125)
})

t('Math.easeOutIn', () => {
  e(Math.easeOutIn(0)).toEqual(0)
  e(Math.easeOutIn(0.25)).toEqual(0.375)
  e(Math.easeOutIn(0.5)).toEqual(0.5)
  e(Math.easeOutIn(0.75)).toEqual(0.625)
  e(Math.easeOutIn(1)).toEqual(1)
  e(Math.easeOutIn(0.25, 3)).toEqual(0.4375)
})

t('Math.equals', () => {
  e(Math.equals(1, 1)).toEqual(true)
  e(Math.equals(0, 1)).toEqual(false)
  e(Math.equals(NEAR_ZERO, 0)).toEqual(true)
  e(Math.equals(NEAR_ZERO, 0, 0)).toEqual(false)
})

t('Math.extent', () => {
  e(Math.extent(0, 1, 2)).toEqual([0, 2])
  e(Math.extent(-1, 0, 1)).toEqual([-1, 1])
  e(Math.extent(-1, 0, 1, NaN)).toEqual([-1, 1])
})

t('Math.factorial', () => {
  e(Math.factorial(1)).toEqual(1)
  e(Math.factorial(2)).toEqual(2)
  e(Math.factorial(3)).toEqual(6)
  e(Math.factorial(4)).toEqual(24)
})

t('Math.floorTo', () => {
  e(Math.floorTo(Math.PI, 2)).toEqual(3.14)
  e(Math.floorTo(Math.PI, 4)).toEqual(3.1415)
  e(Math.floorTo(Math.PI, { multiple: 0.2 })).toEqual(3.0)
  e(Math.floorTo(Math.PI, { multiple: 0.5 })).toEqual(3)
  e(Math.floorTo(4.34201, { multiple: 0.01 })).toBeCloseTo(4.34, Math.TOLERANCE)
})

t('Math.gcd', () => {
  e(Math.gcd(1, 2, 3)).toEqual(1)
  e(Math.gcd(4, 6)).toEqual(2)
  e(Math.gcd(4, 8, 12)).toEqual(4)
})

t('Math.hash', () => {
  e(Math.hash(1)).toEqual(2261973619)
  e(Math.hash(2)).toEqual(229111015)
  e(Math.hash(3)).toEqual(3983417082)
  e(Math.hash(4)).toEqual(2393575859)
  e(Math.hash(5)).toEqual(2793899052)
  // edges
  e(Math.hash(0)).toEqual(0)
  e(Math.hash(-1)).toEqual(2578835075)
  e(Math.hash(Number.MAX_SAFE_INTEGER)).toEqual(2578835075)
})

t('Math.lcm', () => {
  e(Math.lcm(2, 3)).toEqual(6)
  e(Math.lcm(4, 6, 8)).toEqual(24)
})

t('Math.lerp', () => {
  e(Math.lerp(0, 1, 0.1)).toEqual(0.1)
  e(Math.lerp(-1, 1, 0.75)).toEqual(0.5)
  e(Math.lerp(10, 20, 0.5)).toEqual(15)
})

t('Math.lerpAngle', () => {
  e(Math.lerpAngle(0, 10, 0.5)).toEqual(5)
  e(Math.lerpAngle(350, 10, 0.75)).toEqual(5)
  e(Math.lerpAngle(0, 360, 0.5)).toEqual(0)
})

t('Math.log', () => {
  e(Math.log(10)).toBeCloseTo(2.3)
  e(Math.log(10, 2)).toBeCloseTo(3.32)
})

t('Math.map', () => {
  e(Math.map(0.5, 0, 1, 0, 10)).toEqual(5)
  e(Math.map(3, 0, 10, 0, 1)).toEqual(0.3)
})

t('Math.mean', () => {
  e(Math.mean(1)).toEqual(1)
  e(Math.mean(1, 2, 3)).toEqual(2)
  e(Math.mean(-1, 0, 1)).toEqual(0)
})

t('Math.median', () => {
  e(Math.median(1)).toEqual(1)
  e(Math.median(1, 2)).toEqual(1.5)
  e(Math.median(1, 2, 10)).toEqual(2)
  e(Math.median(1, 3, 5, 10)).toEqual(4)
})

t('Math.mod', () => {
  e(Math.mod(0, 360)).toEqual(0)
  e(Math.mod(180, 360)).toEqual(180)
  e(Math.mod(360, 360)).toEqual(0)
  e(Math.mod(540, 360)).toEqual(180)
  e(Math.mod(-180, 360)).toEqual(180)
})

t('Math.mode', () => {
  e(Math.mode(1, 2, 2, 3, 3, 3)).toEqual(3)
})

t('Math.norm', () => {
  e(Math.norm(0, 4, 1)).toEqual(0.25)
  e(Math.norm(0, 10, 5)).toEqual(0.5)
  e(Math.norm(0, 1, 2)).toEqual(2)
  e(Math.norm(0, NEAR_ZERO, 1)).toEqual(0)
})

t('Math.permutations', () => {
  e(Math.permutations([1, 2, 3])).toEqual([
    [1, 2, 3],
    [1, 3, 2],
    [2, 1, 3],
    [2, 3, 1],
    [3, 1, 2],
    [3, 2, 1],
  ])
})

t('Math.quantile', () => {
  e(Math.quantile([1], 0.25)).toEqual(1)
  e(Math.quantile([1, 2], 0.25)).toEqual(1.25)
  e(Math.quantile([1, 2, 10], 0.5)).toEqual(2)
  e(Math.quantile([1, 3, 5, 10], 0.1)).toEqual(1.6)
})

t('Math.radians', () => {
  e(Math.radians(180)).toEqual(Math.PI)
})

t('Math.range', () => {
  e(Array.from(Math.range(0, 3))).toEqual([0, 1, 2, 3])
  e(Array.from(Math.range(1, 4))).toEqual([1, 2, 3, 4])
  e(Array.from(Math.range(2, -2))).toEqual([2, 1, 0, -1, -2])
  e(Array.from(Math.range(-2, 2))).toEqual([-2, -1, 0, 1, 2])
  e(Array.from(Math.range(0, 1, 0.5))).toEqual([0, 0.5, 1])
  e(Array.from(Math.range(1, 0, -0.5))).toEqual([1, 0.5, 0])
  e(Array.from(Math.range(2, -2, -1))).toEqual([2, 1, 0, -1, -2])
})

t('Math.rolling', () => {
  e(Array.from(Math.rolling([1, 2, 3, 4], 1))).toEqual([[1], [2], [3], [4]])
  e(Array.from(Math.rolling([1, 2, 3, 4], 2))).toEqual([
    [1, 2],
    [2, 3],
    [3, 4],
  ])
  e(Array.from(Math.rolling([1, 2, 3, 4], 3))).toEqual([
    [1, 2, 3],
    [2, 3, 4],
  ])
  e(Array.from(Math.rolling([1, 2, 3, 4], 4))).toEqual([[1, 2, 3, 4]])
  e(Array.from(Math.rolling([1, 2, 3, 4], 5))).toEqual([])
})

t('Math.roundTo', () => {
  e(Math.roundTo(Math.PI, 2)).toEqual(3.14)
  e(Math.roundTo(Math.PI, 4)).toEqual(3.1416)
  e(Math.roundTo(Math.PI, { multiple: 0.2 })).toEqual(3.2)
  e(Math.roundTo(Math.PI, { multiple: 0.5 })).toEqual(3)
  e(Math.roundTo(4.342, { multiple: 0.01 })).toBeCloseTo(4.34, Math.TOLERANCE)
  e(Math.roundTo(4.349, { multiple: 0.01 })).toBeCloseTo(4.35, Math.TOLERANCE)
})

t.skip('Math.slerp') // TODO

t('Math.split', () => {
  e(Array.from(Math.split(0, 4, 0))).toEqual([])
  e(Array.from(Math.split(0, 4, 1))).toEqual([2])
  e(Array.from(Math.split(0, 4, 2))).toEqual([0, 4])
  e(Array.from(Math.split(0, 4, 3))).toEqual([0, 2, 4])
  e(Array.from(Math.split(0, 4, 4))).toEqual([0, 1 + 1 / 3, 2 + 2 / 3, 4])
})

t('Math.stddev', () => {
  e(Math.stddev(1, 2, 3)).toEqual(1)
  e(Math.stddev(1, 3, 10, 21, 42)).toBeCloseTo(16.8)
})

t('Math.sum', () => {
  e(Math.sum(1, 2, 3)).toEqual(6)
})

t('Math.truncTo', () => {
  e(Math.truncTo(Math.PI, 2)).toEqual(3.14)
  e(Math.truncTo(Math.PI, 4)).toEqual(3.1415)
  e(Math.truncTo(Math.PI, { multiple: 0.2 })).toEqual(3.0)
  e(Math.truncTo(Math.PI, { multiple: 0.5 })).toEqual(3)
  e(Math.truncTo(4.342, { multiple: 0.01 })).toBeCloseTo(4.34, Math.TOLERANCE)
  e(Math.truncTo(4.349, { multiple: 0.01 })).toBeCloseTo(4.35, Math.TOLERANCE)
})

t('Math.unhash', () => {
  e(Math.unhash(0)).toEqual(0)
  e(Math.unhash(2261973619)).toEqual(1)
  e(Math.unhash(229111015)).toEqual(2)
  e(Math.unhash(3983417082)).toEqual(3)
  e(Math.unhash(2393575859)).toEqual(4)
  e(Math.unhash(2793899052)).toEqual(5)
})

t('Math.variance', () => {
  e(Math.variance(1, 2, 3)).toEqual(1)
  e(Math.variance(1, 3, 10, 21, 42)).toEqual(282.3)
})

t('Math.wrap', () => {
  e(Math.wrap(0, -180, 180)).toEqual(0)
  e(Math.wrap(90, -180, 180)).toEqual(90)
  e(Math.wrap(180, -180, 180)).toEqual(-180)
  e(Math.wrap(360, -180, 180)).toEqual(0)
  e(Math.wrap(540, -180, 180)).toEqual(-180)
  e(Math.wrap(-180, -180, 180)).toEqual(-180)
  e(Math.wrap(180, -180, 180, true)).toEqual(180)
})

t('Math...', () => {
  let M = globalThis.Math
  e(Math.E).toEqual(M.E)
  e(Math.LN2).toEqual(M.LN2)
  e(Math.LN10).toEqual(M.LN10)
  e(Math.LOG2E).toEqual(M.LOG2E)
  e(Math.LOG10E).toEqual(M.LOG10E)
  e(Math.PI).toEqual(M.PI)
  e(Math.SQRT1_2).toEqual(M.SQRT1_2)
  e(Math.SQRT2).toEqual(M.SQRT2)
  e(Math.abs).toEqual(M.abs)
  e(Math.acos).toEqual(M.acos)
  e(Math.acosh).toEqual(M.acosh)
  e(Math.asin).toEqual(M.asin)
  e(Math.atan).toEqual(M.atan)
  e(Math.atanh).toEqual(M.atanh)
  e(Math.atan2).toEqual(M.atan2)
  e(Math.cbrt).toEqual(M.cbrt)
  e(Math.ceil).toEqual(M.ceil)
  e(Math.clz32).toEqual(M.clz32)
  e(Math.cos).toEqual(M.cos)
  e(Math.cosh).toEqual(M.cosh)
  e(Math.exp).toEqual(M.exp)
  e(Math.expm1).toEqual(M.expm1)
  e(Math.floor).toEqual(M.floor)
  e(Math.fround).toEqual(M.fround)
  e(Math.hypot).toEqual(M.hypot)
  e(Math.imul).toEqual(M.imul)
  e(Math.log1p).toEqual(M.log1p)
  e(Math.log10).toEqual(M.log10)
  e(Math.log2).toEqual(M.log2)
  e(Math.max).toEqual(M.max)
  e(Math.min).toEqual(M.min)
  e(Math.pow).toEqual(M.pow)
  e(Math.random).toEqual(M.random)
  e(Math.round).toEqual(M.round)
  e(Math.sin).toEqual(M.sin)
  e(Math.sinh).toEqual(M.sinh)
  e(Math.sqrt).toEqual(M.sqrt)
  e(Math.tan).toEqual(M.tan)
  e(Math.tanh).toEqual(M.tanh)
  e(Math.trunc).toEqual(M.trunc)
})
