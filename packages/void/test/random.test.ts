import { expect as e, test as t } from 'vitest'
import { Math, Random } from '../src'
import { Sketch } from '../src/sketch'

// Run in the context of a sketch with fixed seed.
let s = (fn: () => void) => {
  Sketch.exec(
    Sketch.of({
      construct: () => {},
      container: {} as any,
      el: {} as any,
      overrides: { config: { seed: 0 } },
    }),
    fn
  )
}

// Fill an array of length `n` with the result of `fn`.
let fill = <T>(length: number, fn: (i: number) => T): T[] => {
  return Array(length).fill(null).map(fn)
}

t.skip('Random.binomial')

t('Random.bool', () => {
  s(() => {
    e(Random.bool()).toEqual(true)
    e(Random.bool()).toEqual(true)
    e(Random.bool()).toEqual(false)
    e(Random.bool()).toEqual(false)
    e(Random.bool()).toEqual(true)
    e(Random.bool()).toEqual(false)
  })

  s(() => {
    let sample = fill(2000, () => Number(Random.bool()))
    e(Math.mean(...sample)).toBeCloseTo(0.5)
  })
})

t('Random.choice', () => {
  s(() => {
    e(Random.choice([1, 2, 3])).toEqual(1)
    e(Random.choice([1, 2, 3])).toEqual(1)
    e(Random.choice([1, 2, 3])).toEqual(3)
    e(Random.choice([1, 2, 3], [0, 1, 0])).toEqual(2)
    e(Random.choice([1, 2, 3], [0, 1, 0])).toEqual(2)
    e(Random.choice([1, 2, 3], [0, 1, 0])).toEqual(2)
  })

  s(() => {
    let sample = fill(2000, () => Random.choice([1, 2, 3]))
    e(Math.mean(...sample)).toBeCloseTo(2, 1)
  })

  s(() => {
    let sample = fill(2000, () => Random.choice([1, 2, 3], [0, 1, 0]))
    e(Math.mean(...sample)).toEqual(2)
  })
})

t('Random.coin', () => {
  s(() => {
    e(Random.coin()).toEqual(1)
    e(Random.coin()).toEqual(1)
    e(Random.coin()).toEqual(0)
  })

  s(() => {
    let sample = fill(2000, () => Random.coin())
    e(Math.mean(...sample)).toBeCloseTo(0.5, 1)
  })

  s(() => {
    let sample = fill(2000, () => Random.coin(0.9))
    e(Math.mean(...sample)).toBeCloseTo(0.9, 1)
  })
})

t.skip('Random.exponential')

t('Random.gaussian', () => {
  s(() => {
    e(Random.gaussian(0, 1)).toBeCloseTo(-0.303)
    e(Random.gaussian(0, 1)).toBeCloseTo(-0.311)
    e(Random.gaussian(0, 1)).toBeCloseTo(-0.997)
  })

  s(() => {
    let sample = fill(2000, () => Random.gaussian(5, 10))
    e(Math.mean(...sample)).toBeCloseTo(5, 0)
    e(Math.variance(...sample)).toBeCloseTo(10, 0)
  })
})

t.skip('Random.geometric')

t('Random.float', () => {
  s(() => {
    e(Random.float()).toBeCloseTo(0.236)
    e(Random.float()).toBeCloseTo(0.278)
    e(Random.float()).toBeCloseTo(0.819)
    e(Random.float(5)).toBeCloseTo(3.339)
    e(Random.float(5)).toBeCloseTo(1.92)
    e(Random.float(5)).toBeCloseTo(3.109)
    e(Random.float(0, 10)).toBeCloseTo(3.437)
    e(Random.float(0, 10)).toBeCloseTo(6.4)
    e(Random.float(0, 10)).toBeCloseTo(5.077)
    e(Random.float(0, 10, 0.1)).toEqual(5.8)
    e(Random.float(0, 10, 0.1)).toEqual(8.0)
    e(Random.float(0, 10, 0.1)).toEqual(7.4)
    e(Random.float(0, 10, 2)).toEqual(6)
    e(Random.float(0, 10, 2)).toEqual(10)
    e(Random.float(0, 10, 2)).toEqual(0)
  })

  s(() => {
    let sample = fill(2000, () => Random.float())
    e(Math.mean(...sample)).toBeCloseTo(0.5)
  })

  s(() => {
    let sample = fill(2000, () => Random.float(5))
    e(Math.mean(...sample)).toBeCloseTo(2.5, 1)
  })

  s(() => {
    let sample = fill(2000, () => Random.float(0, 10))
    e(Math.mean(...sample)).toBeCloseTo(5, 1)
  })

  s(() => {
    let sample = fill(2000, () => Random.float(0, 10, 0.1))
    e(Math.mean(...sample)).toBeCloseTo(5, 1)
  })

  s(() => {
    let sample = fill(2000, () => Random.float(0, 10, 2))
    e(Math.mean(...sample)).toBeCloseTo(5, 1)
  })
})

t('Random.int', () => {
  s(() => {
    e(Random.int()).toEqual(0)
    e(Random.int()).toEqual(0)
    e(Random.int()).toEqual(1)
    e(Random.int(5)).toEqual(4)
    e(Random.int(5)).toEqual(2)
    e(Random.int(5)).toEqual(3)
    e(Random.int(0, 10)).toEqual(3)
    e(Random.int(0, 10)).toEqual(7)
    e(Random.int(0, 10)).toEqual(5)
    e(Random.int(0, 10, 0.1)).toEqual(5.8)
    e(Random.int(0, 10, 0.1)).toEqual(8.0)
    e(Random.int(0, 10, 0.1)).toEqual(7.4)
    e(Random.int(0, 10, 2)).toEqual(6)
    e(Random.int(0, 10, 2)).toEqual(10)
    e(Random.int(0, 10, 2)).toEqual(0)
  })

  s(() => {
    let sample = fill(2000, () => Random.int())
    e(Math.mean(...sample)).toBeCloseTo(0.5, 1)
  })

  s(() => {
    let sample = fill(2000, () => Random.int(5))
    e(Math.mean(...sample)).toBeCloseTo(2.5, 1)
  })

  s(() => {
    let sample = fill(2000, () => Random.int(0, 10))
    e(Math.mean(...sample)).toBeCloseTo(5, 1)
  })

  s(() => {
    let sample = fill(2000, () => Random.int(0, 10, 0.1))
    e(Math.mean(...sample)).toBeCloseTo(5, 1)
  })

  s(() => {
    let sample = fill(2000, () => Random.int(0, 10, 2))
    e(Math.mean(...sample)).toBeCloseTo(5, 1)
  })
})

t('Random.noise', () => {
  s(() => {
    e(Random.noise(1)).toBeCloseTo(0.045)
    e(Random.noise(1)).toBeCloseTo(0.045)
    e(Random.noise(1)).toBeCloseTo(0.045)
    e(Random.noise(1)).toBeCloseTo(0.045)
    e(Random.noise(1)).toBeCloseTo(0.045)
    e(Random.noise(2)).toBeCloseTo(0.243)
    e(Random.noise(3)).toBeCloseTo(-0.028)
    e(Random.noise(4)).toBeCloseTo(0.083)
    e(Random.noise(5)).toBeCloseTo(-0.045)
    e(Random.noise(0)).toBeCloseTo(0)
    e(Random.noise(0, 0)).toBeCloseTo(0)
    e(Random.noise(0, 0, 0)).toBeCloseTo(0)
    e(Random.noise(0, 0, 0, 0)).toBeCloseTo(0)
    e(Random.noise(1, 1)).toBeCloseTo(-0.174)
    e(Random.noise(1, 1, 1)).toBeCloseTo(-0.125)
    e(Random.noise(1, 1, 1, 1)).toBeCloseTo(-0.101)
  })

  s(() => {
    let sample = fill(2000, (i) => Random.noise(i))
    e(Math.mean(...sample)).toBeCloseTo(0)
  })

  s(() => {
    let sample = fill(2000, (i) => Random.noise(i, i))
    e(Math.mean(...sample)).toBeCloseTo(0)
  })
})

t.skip('Random.noise3D')

t.skip('Random.noise4D')

t.skip('Random.pareto')

t.skip('Random.poisson')

t('Random.random', () => {
  s(() => {
    e(Random.random()).toBeCloseTo(0.236)
    e(Random.random()).toBeCloseTo(0.278)
    e(Random.random()).toBeCloseTo(0.819)
  })

  s(() => {
    let sample = fill(2000, () => Random.random())
    e(Math.mean(...sample)).toBeCloseTo(0.5, 2)
  })
})

t('Random.roll', () => {
  s(() => {
    e(Random.roll()).toEqual(5)
    e(Random.roll()).toEqual(6)
    e(Random.roll()).toEqual(17)
    e(Random.roll(6)).toEqual(5)
    e(Random.roll(6)).toEqual(3)
    e(Random.roll(6)).toEqual(4)
    e(Random.roll(6, 2)).toEqual(7)
    e(Random.roll(6, 2)).toEqual(8)
    e(Random.roll(6, 2)).toEqual(10)
  })

  s(() => {
    let sample = fill(5000, () => Random.roll())
    e(Math.mean(...sample)).toBeCloseTo(10.5, 0)
  })

  s(() => {
    let sample = fill(3000, () => Random.roll(6))
    e(Math.mean(...sample)).toBeCloseTo(3.5, 1)
  })

  s(() => {
    let sample = fill(3000, () => Random.roll(6, 2))
    e(Math.mean(...sample)).toBeCloseTo(7, 1)
  })
})

t('Random.sample', () => {
  s(() => {
    e(Random.sample(1, [1, 2, 3])).toEqual([1])
    e(Random.sample(1, [1, 2, 3])).toEqual([1])
    e(Random.sample(1, [1, 2, 3])).toEqual([3])
    e(Random.sample(2, [1, 2, 3])).toEqual([3, 1])
    e(Random.sample(2, [1, 2, 3])).toEqual([2, 1])
    e(Random.sample(2, [1, 2, 3])).toEqual([2, 3])
    e(Random.sample(1, [1, 2, 3], [0, 1, 0])).toEqual([2])
    e(Random.sample(1, [1, 2, 3], [0, 1, 0])).toEqual([2])
    e(Random.sample(1, [1, 2, 3], [0, 1, 0])).toEqual([2])
  })

  s(() => {
    let sample = fill(2000, () => Random.sample(1, [1, 2, 3])).flat()
    e(Math.mean(...sample)).toBeCloseTo(2, 1)
  })

  s(() => {
    let sample = fill(2000, () => Random.sample(1, [1, 2, 3], [0, 1, 0])).flat()
    e(Math.mean(...sample)).toEqual(2)
  })
})

t('Random.sign', () => {
  s(() => {
    e(Random.sign()).toEqual(1)
    e(Random.sign()).toEqual(1)
    e(Random.sign()).toEqual(-1)
  })

  s(() => {
    let sample = fill(2000, () => Random.sign())
    e(Math.mean(...sample)).toBeCloseTo(0, 1)
  })
})

t('Random.shuffle', () => {
  s(() => {
    e(Random.shuffle([1, 2, 3])).toEqual([2, 3, 1])
    e(Random.shuffle([1, 2, 3])).toEqual([2, 1, 3])
    e(Random.shuffle([1, 2, 3])).toEqual([1, 3, 2])
  })
})

t.skip('Random.unique')

t('Random.vector', () => {
  s(() => {
    e(Random.vector(2).map((n) => Math.trunc(n, 2))).toEqual([0.64, 0.76])
    e(Random.vector(2).map((n) => Math.trunc(n, 2))).toEqual([0.77, 0.63])
    e(Random.vector(2).map((n) => Math.trunc(n, 2))).toEqual([0.52, 0.85])
  })
})
