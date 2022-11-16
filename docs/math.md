# `Math`

```ts
import { Math } from 'void'
```

The `Math` namespace contains methods that help you work with math! Things like arithmetic, statistics, trigonometry, interpolation, etc.

All the methods are fully treeshakeable, so you will only bundle what you use.

_The native `Math.*` namespace constants and methods are also all re-exported, so that you have everything in one place and can safely shadow the import._

- [**Constants**](#constants)
  - [`Math.PHI`](#mathphi)
  - [`Math.TAU`](#mathtau)
  - [`Math.TOLERANCE`](#mathtolerance)
- [**Interpolation**](#interpolation)
  - [`Math.bounce()`](#mathbounce)
  - [`Math.clamp()`](#mathclamp)
  - [`Math.easeIn()`](#matheasein)
  - [`Math.easeOut()`](#matheaseout)
  - [`Math.easeInOut()`](#matheaseinout)
  - [`Math.easeOutIn()`](#matheaseoutin)
  - [`Math.lerp()`](#mathlerp)
  - [`Math.lerpAngle()`](#mathlerpangle)
  - [`Math.map()`](#mathmap)
  - [`Math.slerp()`](#mathslerp)
  - [`Math.unlerp()`](#mathunlerp)
  - [`Math.wrap()`](#mathwrap)
- [**Rounding**](#rounding)
  - [`Math.ceilTo()`](#mathceil)
  - [`Math.floorTo()`](#mathfloor)
  - [`Math.roundTo()`](#mathround)
  - [`Math.truncTo()`](#mathtrunc)
- [**Arithmetic**](#arithmetic)
  - [`Math.between()`](#mathbetween)
  - [`Math.equals()`](#mathequals)
  - [`Math.gcd()`](#mathgcd)
  - [`Math.lcm()`](#mathlcm)
  - [`Math.mod()`](#mathmod)
- [**Statistics**](#statistics)
  - [`Math.extent()`](#mathextent)
  - [`Math.mean()`](#mathmean)
  - [`Math.median()`](#mathmedian)
  - [`Math.mode()`](#mathmode)
  - [`Math.quantile()`](#mathquantile)
  - [`Math.stddev()`](#mathstddev)
  - [`Math.sum()`](#mathsum)
  - [`Math.variance()`](#mathvariance)
- [**Combinatorics**](#combinatorics)
  - [`Math.combinations()`](#mathcombinations)
  - [`Math.factorial()`](#mathfactorial)
  - [`Math.permutations()`](#mathpermutations)
- [**Iterables**](#iterables)
  - [`Math.array()`](#matharray)
  - [`Math.bins()`](#mathbins)
  - [`Math.range()`](#mathrange)
  - [`Math.rolling()`](#mathrolling)
  - [`Math.split()`](#mathsplit)
- [**Conversions**](#conversions)
  - [`Math.convert()`](#mathconvert)
  - [`Math.degrees()`](#mathdegrees)
  - [`Math.hash()`](#mathhash)
  - [`Math.radians()`](#mathradians)
  - [`Math.unhash()`](#mathunhash)

## Constants

### `Math.PHI`

The golden ratio, approximately `1.618`.

### `Math.TAU`

Twice the value of `Math.PI`, approximately `6.283`.

### `Math.TOLERANCE`

The default tolerance used to ignore floating point errors, `0.000001`.

## Interpolation

### `Math.bounce()`

```ts
Math.bounce(x: number, min: number, max: number) => number
```

Clamp `x` between `min` and `max` by bouncing back and forth between the two, counting from `min` up to `max` and then back down.

### `Math.clamp()`

```ts
Math.clamp(x: number, min: number, max: number) => number
```

Clamp `x` between `min` and `max`.

### `Math.easeIn()`

```ts
Math.easeIn(t: number, power: number) => number
```

Ease a normalized value `t` _in_ by a polynomial power `p`.

This gives you an easy way to ease values in a way that is tweakable. For example, with a power of `2` is quadratic easing, and `3` is cubic easing. But you can also ease by `2.5` or `2.1` or any other decimal value.

### `Math.easeOut()`

```ts
Math.easeOut(t: number, power: number) => number
```

Ease a normalized value `t` _out_ by a polynomial power `p`.

This gives you an easy way to ease values in a way that is tweakable. For example, with a power of `2` is quadratic easing, and `3` is cubic easing. But you can also ease by `2.5` or `2.1` or any other decimal value.

### `Math.easeInOut()`

```ts
Math.easeInOut(t: number, power: number) => number
```

Ease a normalized value `t` _in then out_ by a polynomial power `p`.

This gives you an easy way to ease values in a way that is tweakable. For example, with a power of `2` is quadratic easing, and `3` is cubic easing. But you can also ease by `2.5` or `2.1` or any other decimal value.

### `Math.easeOutIn()`

```ts
Math.easeOutIn(t: number, power: number) => number
```

Ease a normalized value `t` _out then in_ by a polynomial power `p`.

This gives you an easy way to ease values in a way that is tweakable. For example, with a power of `2` is quadratic easing, and `3` is cubic easing. But you can also ease by `2.5` or `2.1` or any other decimal value.

### `Math.lerp()`

```ts
Math.lerp(a: number, b: number, t: number) => number
```

Linearly interpolate between `a` and `b` by a normalized amount `t`.

Note that `t` is not automatically clamped, so you can interpolate out of bounds. But you can always clamp it with [`Math.clamp()`](#mathclamp) first if needed.

```ts
Math.lerp(0, 10, 0.5)
// 5

Math.lerp(3, 6, 0.5)
// 3

Math.lerp(0, 5, 2)
// 10
```

### `Math.lerpAngle()`

```ts
Math.lerpAngle(a: number, b: number,t:number) => number
```

Linearly interpolate an angle _in degrees_ between `a` and `b` by a normalized amount `t`.

### `Math.map()`

```ts
Math.map(x: number, inA: number, inB: number, outA: number, outB: number) => number
```

Map `x` from a scale between `inA` and `inB` to a new scale between `outA` and `outB`.

### `Math.slerp()`

```ts
Math.slerp(a: number, b: number, degrees: number, t: number) => number
```

Spherically interpolate between `a` and `b` by a normalized amout `t` around an angle in `degrees`.

### `Math.unlerp()`

```ts
Math.unlerp(x: number, a: number, b: number) => number
```

Un-interpolate a value `x` between `a` and `b`, returning a normalized value.

Note that the returned value is not clamped to between `0` and `1`, so you can use this for out of bounds values. However you can always use [`Math.clamp()`](#mathclamp) after if needed.

### `Math.wrap()`

```ts
Math.wrap(x: number, min: number, max: number, inclusive?: boolean) => number
```

Clamp `x` between `min` and `max` by wrapping around back to the other side if the number is less than `min` or greater than `max`.

By default `max` is exclusive (eg. `0` to `360`), but you can pass the `inclusive` argument to change this behavior.

## Rounding

### `Math.ceilTo()`

```ts
Math.ceilTo(x: number, precision: number) => number
Math.ceilTo(x: number, options: { multiple: number }) => number
```

Rounds `x` _up_ to the nearest value by a number of decimal places signified by `precision`, or the nearest `multiple`.

### `Math.floorTo()`

```ts
Math.floorTo(x: number, precision: number) => number
Math.floorTo(x: number, options: { multiple: number }) => number
```

Rounds `x` _down_ to the nearest value by a number of decimal places signified by `precision`, or the nearest `multiple`.

### `Math.roundTo()`

```ts
Math.roundTo(x: number, precision: number) => number
Math.roundTo(x: number, options: { multiple: number }) => number
```

Rounds `x` _up or down_ to the nearest value by a number of decimal places signified by `precision`, or the nearest `multiple`.

### `Math.truncTo()`

```ts
Math.truncTo(x: number, precision: number) => number
Math.truncTo(x: number, options: { multiple: number }) => number
```

Rounds `x` _towards zero_ to the nearest value by a number of decimal places signified by `precision`, or the nearest `multiple`.

## Arithmetic

### `Math.between()`

```ts
Math.between(x: number, min: number, max: number, tolerance?: number) => boolean
```

### `Math.equals()`

```ts
Math.equals(a: number, b: number, tolerance?: number) => boolean
```

### `Math.gcd()`

```ts
Math.gcd(...numbers: number[]) => number
```

### `Math.lcm()`

```ts
Math.lcm(...numbers: number[]) => number
```

### `Math.mod()`

```ts
Math.mod(x: number, modulus: number) => number
```

## Statistics

### `Math.extent()`

```ts
Math.extent(...numbers: number[]) => [number, number]
```

### `Math.mean()`

```ts
Math.mean(...numbers: number[]) => number
```

### `Math.median()`

```ts
Math.median(...numbers: number[]) => number
```

### `Math.mode()`

```ts
Math.mode<T>(...values: T[]) => T | undefined
```

### `Math.quantile()`

```ts
Math.quantile(...numbers: number[], p: number[], options?: { sorted: boolean }) => number
```

### `Math.stddev()`

```ts
Math.stddev(...numbers: number[]) => number
```

### `Math.sum()`

```ts
Math.sum(...numbers: number[]) => number
```

### `Math.variance()`

```ts
Math.variance(...numbers: number[]) => number
```

## Combinatorics

### `Math.combinations()`

```ts
Math.combinations<T>(list: T[]) => T[][]
```

### `Math.factorial()`

```ts
Math.factorial(x: number) => number
```

### `Math.permutations()`

```ts
Math.permutations<T>(list: T[]) => T[][]
```

## Iterables

### `Math.array()`

```ts
Math.array(length: number) => number[]
Math.array<T>(length: number, fill: (i: number) => T) => T[]
```

Creates a new array with `length`.

You can optionally pass a `fill` mapping function, which will receive the index and can return any other value to fill the array with.

Note this is just a convenience for the awkward [`Array.from`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) syntax.

### `Math.bins()`

```ts
Math.bins(start: number, end: number, n: number) => Iterable<[number, number]>
```

Return an iterable of `n` bins from `start` to `end` (inclusive). Each bin is a tuple of left and right edges of the sub-range.

Technically, this is just a special combination of [`Math.split()`](#mathsplit) and [`Math.rolling()`](#mathrolling).

```ts
Math.bins(0, 3, 2)
// [0, 1.5]
// [1.5, 3]

Math.bins(0, 3, 3)
// [0, 1]
// [1, 2]
// [2, 3]
```

### `Math.range()`

```ts
Math.range(start: number, end: number, step?: number) => Iterable<number>
```

Return an iterable range beginning at `start` and going until `stop`, with optional `step` to increment by.

```ts
Math.range(1, 4)
// 1
// 2
// 3
// 4

Math.range(0, 1.5, 0.5)
// 0
// 0.5
// 1
// 1.5
```

### `Math.rolling()`

```ts
Math.rolling<T>(iterable: T[], length: number) => Iterable<T[]>
```

Return a new iterable with a rolling window of `length` applied to an existing `iterable`.

```ts
Math.rolling([1, 2, 3, 4, 5], 3)
// [1, 2, 3]
// [2, 3, 4]
// [3, 4, 5]
```

### `Math.split()`

```ts
Math.split(start: number, end: number, length: number) => Iterable<number>
```

Return an iterable from splitting a range from `start` to `end` into a specific `length` of steps.

```ts
Math.split(0, 5, 3)
// 0
// 2.5
// 5

Math.split(0, 5, 1)
// 2.5

Math.split(0, 5, 0)
// [nothing]
```

## Conversions

### `Math.convert()`

```ts
Math.convert(x: number, from: Units, to?: Units, options?: {
  dpi?: number
  precision?: number
}) => number
```

Convert `x` defined in `from` units into `to` units.

If you don't supply an output `to` units, they will default to the units your sketch's canvas is defined in. So by default calling `convert()` to will convert values in any units to the ones you're currently using.

### `Math.degrees()`

```ts
Math.degrees(radians: number) => number
```

Convert an angle in `radians` to its equivalent in degrees.

### `Math.hash()`

```ts
Math.hash(x: number) => number
```

### `Math.radians()`

```ts
Math.radians(degrees: number) => number
```

Convert an angle in `degrees` to its equivalent in radians.

### `Math.unhash()`

```ts
Math.unhash(x: number) => number
```
