# `Math`

```ts
import { Math } from 'void'
```

The `Math` namespace contains the main methods you use to configure and control sketches in Math. You use them to setup your canvas, define custom traits, and hook up interactions.

- [**Constants**](#constants)
  - [`Math.E`](#mathe)
  - [`Math.LN10`](#mathln10)
  - [`Math.LN2`](#mathln2)
  - [`Math.LOG10E`](#mathlog10e)
  - [`Math.LOG2E`](#mathlog2e)
  - [`Math.PI`](#mathpi)
  - [`Math.SQRT1_2`](#mathsqrt1_2)
  - [`Math.SQRT2`](#mathsqrt2)
  - [`Math.PHI`](#mathphi)
  - [`Math.TAU`](#mathtau)
  - [`Math.TOLERANCE`](#mathtolerance)
- [**Rounding**](#rounding)
  - [`Math.ceil()`](#mathceil)
  - [`Math.floor()`](#mathfloor)
  - [`Math.fround()`](#mathfround)
  - [`Math.round()`](#mathround)
  - [`Math.trunc()`](#mathtrunc)
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
  - [`Math.abs()`](#mathabs)
  - [`Math.cbrt()`](#mathcbrt)
  - [`Math.combinations()`](#mathcombinations)
  - [`Math.exp()](#mathexp)
  - [`Math.expm1()](#mathexpm1)
  - [`Math.factorial()`](#mathfactorial)
  - [`Math.gcd()`](#mathgcd)
  - [`Math.hypot()`](#mathhypot)
  - [`Math.imul()`](#mathimul)
  - [`Math.lcm()`](#mathlcm)
  - [`Math.log()`](#mathlog)
  - [`Math.log1p()`](#mathlog1p)
  - [`Math.log10()`](#mathlog10)
  - [`Math.log2()`](#mathlog2)
  - [`Math.mod()`](#mathmod)
  - [`Math.permutations()`](#mathpermutations)
  - [`Math.pow()`](#mathpow)
  - [`Math.quantile()`](#mathquantile)
  - [`Math.sign()`](#mathsign)
  - [`Math.sqrt()](#mathsqrt)
- [**Statistics**](#statistics)
  - [`Math.extent()`](#mathextent)
  - [`Math.max()`](#mathmax)
  - [`Math.mean()`](#mathmean)
  - [`Math.median()`](#mathmedian)
  - [`Math.min()`](#mathmin)
  - [`Math.mode()`](#mathmode)
  - [`Math.quantile()`](#mathquantile)
  - [`Math.random()`](#mathrandom)
  - [`Math.stddev()`](#mathstddev)
  - [`Math.sum()`](#mathsum)
  - [`Math.variance()`](#mathvariance)
- [**Conversions**](#conversions)
  - [`Math.clz32()`](#mathclz32)
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
- [**Trigonometry**](#trigonometry)
  - [`Math.acos()`](#mathacos)
  - [`Math.acosh()`](#mathacosh)
  - [`Math.asin()`](#mathasin)
  - [`Math.asinh()`](#mathasinh)
  - [`Math.atan()`](#mathatan)
  - [`Math.atanh()`](#mathatanh)
  - [`Math.atan2()`](#mathatan2)
  - [`Math.cos()`](#mathcos)
  - [`Math.cosh()`](#mathcosh)
  - [`Math.sin()`](#mathsin)
  - [`Math.sinh()`](#mathsinh)
  - [`Math.tan()`](#mathtan)
  - [`Math.tanh()`](#mathtanh)
- [**Utils**](#utils)
  - [`Math.equals()`](#mathequals)
  - [`Math.isBetween()`](#mathisbetween)
  - [`Math.isInteger()`](#mathisinteger)
  - [`Math.isNaN()`](#mathisnan)
  - [`Math.isNegative()`](#mathisnegative)
  - [`Math.isPositive()`](#mathispositive)
  - [`Math.isZero()`](#mathiszero)

## Constants

### `Math.E` (native)

Euler's number, the base of natural logarithms, `e`, which is approximately `2.718`.

### `Math.LN2`

The natural logarithm of 2, approximately `0.693`.

### `Math.LN10`

The natural logarithm of 10, approximately `2.302`.

### `Math.LOG2E`

The base 2 logarithm of `e`, approximately `1.442`.

### `Math.LOG10E`

The base 10 logarithm of `e`, approximately `0.434`.

### `Math.PI`

The ratio of the circumference of a circle to its diameter, approximately `3.14159`.

### `Math.SQRT1_2`

The square root of 1/2 which is approximately `0.707`.

### `Math.SQRT2`

The square root of 2, approximately `1.414`.

### `Math.PHI`

### `Math.TAU`

### `Math.TOLERANCE`

## Rounding

### `Math.ceil()`

Rounds up and returns the smaller integer greater than or equal to a given number.

### `Math.floor()`

Rounds down and returns the largest integer less than or equal to a given number.

### `Math.round()`

Returns the value of a number rounded to the nearest integer.

### `Math.trunc()`

Returns the integer part of a number by removing any fractional digits.

## Interpolation

### `Math.bounce()`

### `Math.clamp()`

### `Math.easeIn()`

### `Math.easeOut()`

### `Math.easeInOut()`

### `Math.easeOutIn()`

### `Math.lerp()`

### `Math.lerpAngle()`

### `Math.map()`

### `Math.slerp()`

### `Math.unlerp()`

### `Math.wrap()`

## Arithmetic

### `Math.abs()`

Returns the absolute value of a number.

### `Math.cbrt()`

Returns the cube root of a number.

### `Math.combinations()`

### `Math.exp()`

Returns `e` raised to the power of a number.

### `Math.expm1()`

Returns `e` raised to the power of a number, subtracted by `1`.

### `Math.factorial()`

### `Math.gcd()`

### `Math.hypot()`

Returns the square root of the sum of squares of its arguments.

### `Math.imul()`

Returns the result of the C-like 32-bit multiplication of the two parameters.

### `Math.lcm()`

### `Math.log()`

Returns the natural logarithm (base `e`) of a number.

### `Math.log1p()`

Returns the natural logarithm (base `e`) of `1 + x`, where `x` is the argument.

### `Math.log10()`

Returns the base 10 logarithm of a number.

### `Math.log2()`

Returns the base 2 logarithm of a number.

### `Math.mod()`

### `Math.permutations()`

### `Math.pow()`

Returns the value of a base raised to a power.

### `Math.quantile()`

### `Math.sign()`

Returns `1` or `-1`, indicating the sign of the number passed as argument. If the input is ``0` or `-0`, it will be returned as-is.

### `Math.sqrt()`

Returns the square root of a number.

## Statistics

### `Math.extent()`

### `Math.max()`

Returns the largest of the numbers given as input parameters, or `-Infinity` if there are no parameters.

### `Math.mean()`

### `Math.median()`

### `Math.min()`

Returns the smallest of the numbers given as input parameters, or `Infinity` if there are no parameters.

### `Math.mode()`

### `Math.quantile()`

### `Math.random()`

Returns a floating-point, pseudo-random number that's greater than or equal to 0 and less than 1, with approximately uniform distribution over that range — which you can then scale to your desired range. The implementation selects the initial seed to the random number generation algorithm; it cannot be chosen or reset by the user.

### `Math.stddev()`

### `Math.sum()`

### `Math.variance()`

## Conversions

### `Math.convert()`

### `Math.degrees()`

### `Math.fround()`

Returns the nearest 32-bit single precision float representation of a number.

### `Math.hash()`

### `Math.radians()`

### `Math.unhash()`

## Ranges

### `Math.range()`

### `Math.rolling()`

### `Math.split()`

### `Math.subdivide()`

## Trigonometry

### `Math.acos()`

Returns the inverse cosine (in radians) of a number.

### `Math.acosh()`

Returns the inverse hyperbolic cosine of a number.

### `Math.asin()`

Returns the inverse sine (in radians) of a number.

### `Math.asinh()`

Returns the inverse hyperbolic sine of a number.

### `Math.atan()`

Returns the inverse tangent (in radians) of a number.

### `Math.atanh()`

Returns the inverse hyperbolic tangent of a number.

### `Math.atan2()`

Returns the angle in the plane (in radians) between the positive x-axis and the ray from (0, 0) to the point (x, y), for Math.atan2(y, x).

### `Math.cos()`

Returns the cosine of a number in radians.

### `Math.cosh()`

Returns the hyperbolic cosine of a number.

### `Math.sin()`

Returns the sine of a number in radians.

### `Math.sinh()`

Returns the hyperbolic sine of a number.

### `Math.tan()`

Returns the tangent of a number in radians.

### `Math.tanh()`

Returns the hyperbolic tangent of a number.

## Utils

### `Math.clz32()`

Returns the number of leading zero bits in the 32-bit binary representation of a number.

### `Math.equals()`

### `Math.isBetween()`

### `Math.isInteger()`

Determines whether the passed value is an integer.

### `Math.isNaN()`

Determines whether the passed value is NaN and its type is Number. It is a more robust version of the original, global isNaN().

### `Math.isNegative()`

### `Math.isPositive()`

### `Math.isZero()`
