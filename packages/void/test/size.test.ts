import { test, expect as e } from 'vitest'
import { Size } from '../src'

test('Size.dimensions', () => {
  e(Size.dimensions('A4')).toEqual([210, 297, 'mm'])
  e(Size.dimensions('1080p')).toEqual([1920, 1080, 'px'])
})

test('Size.is', () => {
  e(Size.is('A4')).toEqual(true)
  e(Size.is('1080p')).toEqual(true)
  e(Size.is('unknown')).toEqual(false)
})

test('Size.match', () => {
  e(Size.match(8.5, 11, 'in')).toEqual('Letter')
  e(Size.match(11, 8.5, 'in')).toEqual('Letter')
  e(Size.match(8.5, 8.5, 'in')).toEqual(null)
})
