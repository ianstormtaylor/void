import { expect as e, test as t } from 'vitest'
import { math } from '../src'

// Some floating point math that gets near zero but not quite.
let NEAR_ZERO = 0.1 + 0.2 - 0.3

t.skip('math.trunc')
t.skip('math.gcd')
t.skip('math.lcm')
t.skip('math.factorial')
t.skip('math.combination')
t.skip('math.permutation')
t.skip('math.mode')
t.skip('math.median')
t.skip('math.quantize???')
t.skip('math.product')
t.skip('math.normalize???')
t.skip('math.minIndex')
t.skip('math.maxIndex')

t('math.PHI', () => {
  e(math.PHI).toEqual((1 + Math.sqrt(5)) / 2)
})

t('math.TAU', () => {
  e(math.TAU).toEqual(Math.PI * 2)
})

t('math.TOLERANCE', () => {
  e(math.TOLERANCE).toEqual(0.000001)
})

t('math.bounce', () => {
  e(math.bounce(-7, 0, 3)).toEqual(1)
  e(math.bounce(-5, 0, 3)).toEqual(1)
  e(math.bounce(-3, 0, 3)).toEqual(3)
  e(math.bounce(-1, 0, 3)).toEqual(1)
  e(math.bounce(0, 0, 3)).toEqual(0)
  e(math.bounce(1, 0, 3)).toEqual(1)
  e(math.bounce(3, 0, 3)).toEqual(3)
  e(math.bounce(5, 0, 3)).toEqual(1)
  e(math.bounce(7, 0, 3)).toEqual(1)

  e(math.bounce(-5, -2, 2)).toEqual(1)
  e(math.bounce(-3, -2, 2)).toEqual(-1)
  e(math.bounce(-1, -2, 2)).toEqual(-1)
  e(math.bounce(0, -2, 2)).toEqual(0)
  e(math.bounce(1, -2, 2)).toEqual(1)
  e(math.bounce(3, -2, 2)).toEqual(1)
  e(math.bounce(5, -2, 2)).toEqual(-1)
})

t('math.ceil', () => {
  e(math.ceil(4.2)).toEqual(5)
  e(math.ceil(4.0)).toEqual(4)
  e(math.ceil(Math.PI, 2)).toEqual(3.14)
  e(math.ceil(Math.PI, 4)).toEqual(3.1414)
  e(math.ceil(Math.PI, { precision: 2 })).toEqual(3.14)
  e(math.ceil(Math.PI, { precision: 4 })).toEqual(3.1414)
  e(math.ceil(Math.PI, { multiple: 0.2 })).toEqual(3.2)
  e(math.ceil(Math.PI, { multiple: 0.5 })).toEqual(3)
  e(math.ceil(4.34201, { multiple: 0.01 })).toBeCloseTo(4.35, math.TOLERANCE)
})

t('math.clamp', () => {
  e(math.clamp(-1.3, 0, 1)).toEqual(0)
  e(math.clamp(0.4, 0, 1)).toEqual(0.4)
  e(math.clamp(1.2, 0, 1)).toEqual(1)
})

t('math.convert', () => {
  e(math.convert(1, 'px')).toEqual(1)
  // imperial
  e(math.convert(1, 'pt')).toEqual(1)
  e(math.convert(1, 'pc')).toEqual(72 / 6)
  e(math.convert(1, 'in')).toEqual(72)
  e(math.convert(1, 'ft')).toEqual(72 * 12)
  e(math.convert(1, 'yd')).toEqual(72 * 12 * 3)
  // metric
  e(math.convert(1, 'mm')).toBeCloseTo(2.834645)
  e(math.convert(1, 'cm')).toBeCloseTo(28.34645)
  e(math.convert(1, 'm')).toBeCloseTo(2834.645)
  // to specific units
  e(math.convert(1, 'in', { to: 'in' })).toEqual(1)
  e(math.convert(1, 'ft', { to: 'in' })).toEqual(12)
  e(math.convert(1, 'cm', { to: 'mm' })).toEqual(10)
  e(math.convert(1, 'in', { to: 'cm' })).toEqual(2.54)
  // custom dpi
  e(math.convert(1, 'in', { dpi: 10 })).toEqual(10)
  // custom precision
  e(math.convert(1, 'mm', { precision: 1 })).toEqual(3)
  e(math.convert(1, 'mm', { precision: 0.1 })).toBeCloseTo(2.8)
  e(math.convert(1, 'mm', { precision: 0.01 })).toBeCloseTo(2.83)
  e(math.convert(1, 'mm', { precision: 2 })).toEqual(2)
})

t('math.degrees', () => {
  e(math.degrees(0)).toEqual(0)
  e(math.degrees(Math.PI / 2)).toEqual(90)
  e(math.degrees(Math.PI)).toEqual(180)
  e(math.degrees((Math.PI * 3) / 2)).toEqual(270)
  e(math.degrees(math.TAU)).toEqual(360)
})

t('math.easeIn', () => {
  e(math.easeIn(0)).toEqual(0)
  e(math.easeIn(0.25)).toEqual(0.0625)
  e(math.easeIn(0.5)).toEqual(0.25)
  e(math.easeIn(0.75)).toEqual(0.5625)
  e(math.easeIn(1)).toEqual(1)
  e(math.easeIn(0.25, 3)).toEqual(0.015625)
})

t('math.easeInOut', () => {
  e(math.easeInOut(0)).toEqual(0)
  e(math.easeInOut(0.25)).toEqual(0.125)
  e(math.easeInOut(0.5)).toEqual(0.5)
  e(math.easeInOut(0.75)).toEqual(0.875)
  e(math.easeInOut(1)).toEqual(1)
  e(math.easeInOut(0.25, 3)).toEqual(0.0625)
})

t('math.easeOut', () => {
  e(math.easeOut(0)).toEqual(0)
  e(math.easeOut(0.25)).toEqual(0.4375)
  e(math.easeOut(0.5)).toEqual(0.75)
  e(math.easeOut(0.75)).toEqual(0.9375)
  e(math.easeOut(1)).toEqual(1)
  e(math.easeOut(0.25, 3)).toEqual(0.578125)
})

t('math.easeOutIn', () => {
  e(math.easeOutIn(0)).toEqual(0)
  e(math.easeOutIn(0.25)).toEqual(0.375)
  e(math.easeOutIn(0.5)).toEqual(0.5)
  e(math.easeOutIn(0.75)).toEqual(0.625)
  e(math.easeOutIn(1)).toEqual(1)
  e(math.easeOutIn(0.25, 3)).toEqual(0.4375)
})

t('math.equals', () => {
  e(math.equals(1, 1)).toEqual(true)
  e(math.equals(0, 1)).toEqual(false)
  e(math.equals(NEAR_ZERO, 0)).toEqual(true)
  e(math.equals(NEAR_ZERO, 0, 0)).toEqual(false)
})

t('math.floor', () => {
  e(math.floor(4.2)).toEqual(4)
  e(math.floor(4.0)).toEqual(4)
  e(math.floor(4.2, 2)).toEqual(4)
  e(math.floor(4.34201, 0.01)).toBeCloseTo(4.34, math.TOLERANCE)
})

t('math.isBetween', () => {
  e(math.isBetween(1, 0, 2)).toEqual(true)
  e(math.isBetween(0, 1, 2)).toEqual(false)
  e(math.isBetween(NEAR_ZERO, 0, 2)).toEqual(false)
})

t('math.isInteger', () => {
  e(math.isInteger(0)).toEqual(true)
  e(math.isInteger(1)).toEqual(true)
  e(math.isInteger(-1)).toEqual(true)
  e(math.isInteger(0.5)).toEqual(false)
  e(math.isInteger(NEAR_ZERO)).toEqual(true)
})

t('math.lerp', () => {
  e(math.lerp(0, 1, 0.1)).toEqual(0.1)
  e(math.lerp(-1, 1, 0.75)).toEqual(0.5)
  e(math.lerp(10, 20, 0.5)).toEqual(15)
})

t('math.lerpAngle', () => {
  e(math.lerpAngle(0, 10, 0.5)).toEqual(5)
  e(math.lerpAngle(350, 10, 0.75)).toEqual(5)
  e(math.lerpAngle(0, 360, 0.5)).toEqual(0)
})

t('math.mean', () => {
  e(math.mean(1)).toEqual(1)
  e(math.mean(1, 2, 3)).toEqual(2)
  e(math.mean(-1, 0, 1)).toEqual(0)
})

t('math.mod', () => {
  e(math.mod(0, 360)).toEqual(0)
  e(math.mod(180, 360)).toEqual(180)
  e(math.mod(360, 360)).toEqual(0)
  e(math.mod(540, 360)).toEqual(180)
  e(math.mod(-180, 360)).toEqual(180)
})

t('math.mode', () => {
  e(math.mode(1, 2, 2, 3, 3, 3)).toEqual(3)
})

t('math.radians', () => {
  e(math.radians(180)).toEqual(Math.PI)
})

t('math.range', () => {
  e(math.range(0)).toEqual([])
  e(math.range(3)).toEqual([0, 1, 2])
  e(math.range(-3)).toEqual([0, -1, -2])
  e(math.range(0, 3)).toEqual([0, 1, 2, 3])
  e(math.range(1, 4)).toEqual([1, 2, 3, 4])
  e(math.range(2, -2)).toEqual([2, 1, 0, -1, -2])
  e(math.range(-2, 2)).toEqual([-2, -1, 0, 1, 2])
  e(math.range(0, 1, 0.5)).toEqual([0, 0.5, 1])
})

t('math.roll', () => {
  e(math.roll([1, 2, 3, 4], 1)).toEqual([[1], [2], [3], [4]])
  // prettier-ignore
  e(math.roll([1, 2, 3, 4], 2)).toEqual([[1, 2], [2, 3], [3, 4]])
  // prettier-ignore
  e(math.roll([1, 2, 3, 4], 3)).toEqual([[1,2,3], [2,3,4]])
  e(math.roll([1], 2)).toEqual([])
})

t('math.round', () => {
  e(math.round(4.2)).toEqual(4)
  e(math.round(4.7)).toEqual(5)
  e(math.round(4.0)).toEqual(4)
  e(math.round(4.2, 2)).toEqual(4)
  e(math.round(5.1, 2)).toEqual(6)
  e(math.round(4.34201, 0.01)).toBeCloseTo(4.34, math.TOLERANCE)
  e(math.round(4.38741, 0.01)).toBeCloseTo(4.39, math.TOLERANCE)
})

t('math.sign', () => {
  e(math.sign(-7)).toEqual(-1)
  e(math.sign(0)).toEqual(0)
  e(math.sign(7)).toEqual(1)
})

t.skip('math.slerp') // TODO

t('math.split', () => {
  // prettier-ignore
  e(math.split(0, 1, 1)).toEqual([[0,1]])
  // prettier-ignore
  e(math.split(0, 1, 2)).toEqual([[0,0.5], [0.5,1]])
  // prettier-ignore
  e(math.split(0, 10, 4)).toEqual([[0,2.5], [2.5,5], [5,7.5], [7.5,10]])
})

t('math.subdivide', () => {
  e(math.subdivide(0, 1, 0)).toEqual([])
  e(math.subdivide(0, 1, 1)).toEqual([0.5])
  e(math.subdivide(0, 1, 2)).toEqual([0, 1])
  e(math.subdivide(0, 1, 3)).toEqual([0, 0.5, 1])
  e(math.subdivide(5, 15, 5)).toEqual([5, 7.5, 10, 12.5, 15])
})

t('math.sum', () => {
  e(math.sum(1, 2, 3)).toEqual(6)
})

t('math.unlerp', () => {
  e(math.unlerp(0, 4, 1)).toEqual(0.25)
  e(math.unlerp(0, 10, 5)).toEqual(0.5)
  e(math.unlerp(0, 1, 2)).toEqual(2)
  e(math.unlerp(0, NEAR_ZERO, 1)).toEqual(0)
})

t('math.wrap', () => {
  e(math.wrap(0, -180, 180)).toEqual(0)
  e(math.wrap(90, -180, 180)).toEqual(90)
  e(math.wrap(180, -180, 180)).toEqual(-180)
  e(math.wrap(360, -180, 180)).toEqual(0)
  e(math.wrap(540, -180, 180)).toEqual(-180)
  e(math.wrap(-180, -180, 180)).toEqual(-180)
  e(math.wrap(180, -180, 180, true)).toEqual(180)
})
