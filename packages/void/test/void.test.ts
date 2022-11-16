import { expect as e, test as t } from 'vitest'
import { Void } from '../src'

t('Void.convert', () => {
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
