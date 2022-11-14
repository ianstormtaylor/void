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
- [**Rounding**](#rounding)
  - [`Math.ceilTo()`](#mathceil)
  - [`Math.floorTo()`](#mathfloor)
  - [`Math.roundTo()`](#mathround)
  - [`Math.truncTo()`](#mathtrunc)
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
- [**Arithmetic**](#arithmetic)
  - [`Math.between()`](#mathbetween)
  - [`Math.combinations()`](#mathcombinations)
  - [`Math.equals()`](#mathequals)
  - [`Math.factorial()`](#mathfactorial)
  - [`Math.gcd()`](#mathgcd)
  - [`Math.lcm()`](#mathlcm)
  - [`Math.mod()`](#mathmod)
  - [`Math.permutations()`](#mathpermutations)
  - [`Math.quantile()`](#mathquantile)
- [**Statistics**](#statistics)
  - [`Math.extent()`](#mathextent)
  - [`Math.mean()`](#mathmean)
  - [`Math.median()`](#mathmedian)
  - [`Math.mode()`](#mathmode)
  - [`Math.quantile()`](#mathquantile)
  - [`Math.stddev()`](#mathstddev)
  - [`Math.sum()`](#mathsum)
  - [`Math.variance()`](#mathvariance)
- [**Conversions**](#conversions)
  - [`Math.convert()`](#mathconvert)
  - [`Math.degrees()`](#mathdegrees)
  - [`Math.hash()`](#mathhash)
  - [`Math.radians()`](#mathradians)
  - [`Math.unhash()`](#mathunhash)
- [**Ranges**](#ranges)
  - [`Math.range()`](#mathrange)
  - [`Math.rolling()`](#mathrolling)
  - [`Math.split()`](#mathsplit)
  - [`Math.subdivide()`](#mathsubdivide)

## Constants

### `Math.PHI`

The golden ratio, approximately `1.618`.

### `Math.TAU`

Twice the value of `Math.PI`, approximately `6.283`.

### `Math.TOLERANCE`

The default tolerance used to ignore floating point errors, `0.000001`.

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

## Arithmetic

### `Math.combinations()`

### `Math.equals()`

### `Math.factorial()`

### `Math.gcd()`

### `Math.includes()`

### `Math.lcm()`

### `Math.mod()`

### `Math.permutations()`

### `Math.quantile()`

## Statistics

### `Math.extent()`

### `Math.mean()`

### `Math.median()`

### `Math.mode()`

### `Math.quantile()`

### `Math.stddev()`

### `Math.sum()`

### `Math.variance()`

## Conversions

### `Math.convert()`

### `Math.degrees()`

### `Math.hash()`

### `Math.radians()`

### `Math.unhash()`

## Ranges

### `Math.range()`

### `Math.rolling()`

### `Math.split()`

### `Math.subdivide()`
