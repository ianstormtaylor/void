// import { expect as e, test as t } from 'vitest'
// import { Math, Random } from '../src'
// import { createPrng } from '../src/utils'

// // Run in the context of a sketch with fixed seed.
// let r = (fn: () => void) => {
//   Random.seed(createPrng(1), fn)
// }

// // Fill an array of length `n` with the result of `fn`.
// let fill = <T>(length: number, fn: (i: number) => T): T[] => {
//   return Array(length).fill(null).map(fn)
// }

// t.skip('Random.binomial')

// t('Random.bool', () => {
//   r(() => {
//     e(Random.bool()).toEqual(true)
//     e(Random.bool()).toEqual(false)
//     e(Random.bool()).toEqual(true)
//     e(Random.bool()).toEqual(true)
//   })

//   r(() => {
//     let sample = fill(10000, () => Number(Random.bool()))
//     e(Math.mean(...sample)).toBeCloseTo(0.5)
//   })
// })

// t('Random.gaussian', () => {
//   r(() => {
//     e(Random.gaussian(0, 1)).toBeCloseTo(1.855)
//     e(Random.gaussian(0, 1)).toBeCloseTo(-1.652)
//     e(Random.gaussian(0, 1)).toBeCloseTo(0.259)
//     e(Random.gaussian(0, 1)).toBeCloseTo(-0.804)
//     e(Random.gaussian(0, 1)).toBeCloseTo(0.884)
//   })

//   r(() => {
//     let gaussian = Random.gaussian(5, 10)
//     let sample = fill(3000, () => gaussian())
//     e(Math.mean(...sample)).toBeCloseTo(5, 0)
//     e(Math.variance(...sample)).toBeCloseTo(10, 0)
//   })
// })

// t('Random.float', () => {
//   r(() => {
//     e(Random.float()).toBeCloseTo(0.104)
//     e(Random.float()).toBeCloseTo(0.919)
//     e(Random.float()).toBeCloseTo(0.234)
//     e(Random.float(5)).toBeCloseTo(2.304)
//     e(Random.float(5)).toBeCloseTo(4.828)
//     e(Random.float(5)).toBeCloseTo(0.142)
//     e(Random.float(0, 10)).toBeCloseTo(7.231)
//     e(Random.float(0, 10)).toBeCloseTo(5.071)
//     e(Random.float(0, 10)).toBeCloseTo(6.741)
//     e(Random.float(0, 10, 0.1)).toEqual(0.1)
//     e(Random.float(0, 10, 0.1)).toEqual(2.2)
//     e(Random.float(0, 10, 0.1)).toEqual(1.6)
//     e(Random.float(0, 10, 2)).toEqual(0)
//     e(Random.float(0, 10, 2)).toEqual(6)
//     e(Random.float(0, 10, 2)).toEqual(4)
//   })

//   r(() => {
//     let sample = fill(3000, () => Random.float())
//     e(Math.mean(...sample)).toBeCloseTo(0.5)
//   })

//   r(() => {
//     let sample = fill(3000, () => Random.float(5))
//     e(Math.mean(...sample)).toBeCloseTo(2.5, 1)
//   })

//   r(() => {
//     let sample = fill(3000, () => Random.float(0, 10))
//     e(Math.mean(...sample)).toBeCloseTo(5, 1)
//   })

//   r(() => {
//     let sample = fill(3000, () => Random.float(0, 10, 0.1))
//     e(Math.mean(...sample)).toBeCloseTo(5, 1)
//   })

//   r(() => {
//     let sample = fill(3000, () => Random.float(0, 10, 2))
//     e(Math.mean(...sample)).toBeCloseTo(5, 1)
//   })
// })

// t('Random.int', () => {
//   r(() => {
//     e(Random.int()).toEqual(0)
//     e(Random.int()).toEqual(1)
//     e(Random.int()).toEqual(0)
//     e(Random.int(5)).toEqual(2)
//     e(Random.int(5)).toEqual(5)
//     e(Random.int(5)).toEqual(0)
//     e(Random.int(0, 10)).toEqual(7)
//     e(Random.int(0, 10)).toEqual(5)
//     e(Random.int(0, 10)).toEqual(7)
//     e(Random.int(0, 10, 0.1)).toEqual(0.1)
//     e(Random.int(0, 10, 0.1)).toEqual(2.2)
//     e(Random.int(0, 10, 0.1)).toEqual(1.6)
//     e(Random.int(0, 10, 2)).toEqual(0)
//     e(Random.int(0, 10, 2)).toEqual(6)
//     e(Random.int(0, 10, 2)).toEqual(4)
//   })

//   r(() => {
//     let sample = fill(3000, () => Random.int())
//     e(Math.mean(...sample)).toBeCloseTo(0.5, 1)
//   })

//   r(() => {
//     let sample = fill(3000, () => Random.int(5))
//     e(Math.mean(...sample)).toBeCloseTo(2.5, 1)
//   })

//   r(() => {
//     let sample = fill(3000, () => Random.int(0, 10))
//     e(Math.mean(...sample)).toBeCloseTo(5, 1)
//   })

//   r(() => {
//     let sample = fill(3000, () => Random.int(0, 10, 0.1))
//     e(Math.mean(...sample)).toBeCloseTo(5, 1)
//   })

//   r(() => {
//     let sample = fill(3000, () => Random.int(0, 10, 2))
//     e(Math.mean(...sample)).toBeCloseTo(5, 1)
//   })
// })

// t('Random.noise', () => {
//   r(() => {
//     e(Random.noise(1)).toBeCloseTo(0.165)
//     e(Random.noise(1)).toBeCloseTo(0.165)
//     e(Random.noise(1)).toBeCloseTo(0.165)
//     e(Random.noise(2)).toBeCloseTo(0.179)
//     e(Random.noise(3)).toBeCloseTo(0.068)
//     e(Random.noise(4)).toBeCloseTo(-0.032)
//     e(Random.noise(5)).toBeCloseTo(-0.086)
//     e(Random.noise(0)).toBeCloseTo(0)
//     e(Random.noise(0, 0)).toBeCloseTo(0)
//     e(Random.noise(0, 0, 0)).toBeCloseTo(0)
//     e(Random.noise(0, 0, 0, 0)).toBeCloseTo(0)
//     e(Random.noise(1, 1)).toBeCloseTo(0.091)
//     e(Random.noise(1, 1, 1)).toBeCloseTo(-0.106)
//     e(Random.noise(1, 1, 1, 1)).toBeCloseTo(-0.274)
//   })

//   r(() => {
//     let sample = fill(3000, (i) => Random.noise(i))
//     e(Math.mean(...sample)).toBeCloseTo(0)
//   })

//   r(() => {
//     let sample = fill(3000, (i) => Random.noise(i, i))
//     e(Math.mean(...sample)).toBeCloseTo(0)
//   })
// })

// t('Random.pick', () => {
//   r(() => {
//     e(Random.pick([1, 2, 3])).toEqual(1)
//     e(Random.pick([1, 2, 3])).toEqual(3)
//     e(Random.pick([1, 2, 3])).toEqual(1)
//     e(Random.pick([1, 2, 3], [0, 1, 0])).toEqual(2)
//     e(Random.pick([1, 2, 3], [0, 1, 0])).toEqual(2)
//     e(Random.pick([1, 2, 3], [0, 1, 0])).toEqual(2)
//   })

//   r(() => {
//     let sample = fill(3000, () => Random.pick([1, 2, 3]))
//     e(Math.mean(...sample)).toBeCloseTo(2, 1)
//   })

//   r(() => {
//     let sample = fill(3000, () => Random.pick([1, 2, 3], [0, 1, 0]))
//     e(Math.mean(...sample)).toEqual(2)
//   })
// })

// t('Random.random', () => {
//   r(() => {
//     e(Random.random()).toBeCloseTo(0.104)
//     e(Random.random()).toBeCloseTo(0.919)
//     e(Random.random()).toBeCloseTo(0.234)
//   })

//   r(() => {
//     let sample = fill(3000, () => Random.random())
//     e(Math.mean(...sample)).toBeCloseTo(0.5, 2)
//   })
// })

// t('Random.sample', () => {
//   r(() => {
//     e(Random.sample(1, [1, 2, 3])).toEqual([1])
//     e(Random.sample(1, [1, 2, 3])).toEqual([3])
//     e(Random.sample(1, [1, 2, 3])).toEqual([1])
//     e(Random.sample(2, [1, 2, 3])).toEqual([2, 3])
//     e(Random.sample(2, [1, 2, 3])).toEqual([1, 3])
//     e(Random.sample(2, [1, 2, 3])).toEqual([2, 3])
//     e(Random.sample(1, [1, 2, 3], [0, 1, 0])).toEqual([2])
//     e(Random.sample(1, [1, 2, 3], [0, 1, 0])).toEqual([2])
//     e(Random.sample(1, [1, 2, 3], [0, 1, 0])).toEqual([2])
//   })

//   r(() => {
//     let sample = fill(3000, () => Random.sample(1, [1, 2, 3])).flat()
//     e(Math.mean(...sample)).toBeCloseTo(2, 1)
//   })

//   r(() => {
//     let sample = fill(3000, () => Random.sample(1, [1, 2, 3], [0, 1, 0])).flat()
//     e(Math.mean(...sample)).toEqual(2)
//   })
// })

// t('Random.sign', () => {
//   r(() => {
//     e(Random.sign()).toEqual(1)
//     e(Random.sign()).toEqual(-1)
//     e(Random.sign()).toEqual(1)
//   })

//   r(() => {
//     let sample = fill(3000, () => Random.sign())
//     e(Math.mean(...sample)).toBeCloseTo(0, 1)
//   })
// })

// t('Random.shuffle', () => {
//   r(() => {
//     e(Random.shuffle([1, 2, 3])).toEqual([3, 2, 1])
//     e(Random.shuffle([1, 2, 3])).toEqual([1, 3, 2])
//     e(Random.shuffle([1, 2, 3])).toEqual([1, 2, 3])
//   })
// })

// t('Random.vector', () => {
//   r(() => {
//     e(Random.vector(2).map((n) => Math.truncTo(n, 2))).toEqual([0.81, 0.57])
//     e(Random.vector(2).map((n) => Math.truncTo(n, 2))).toEqual([0.68, 0.72])
//     e(Random.vector(2).map((n) => Math.truncTo(n, 2))).toEqual([0.99, 0.02])
//   })
// })
