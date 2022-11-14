# `Random`

```ts
import { Random } from 'void'
```

The `Random` namespace contains methods that help in generating seeded random values. This includes the basics like booleans, floats, and integers. But also more complex use cases like choosing elements from an array, generating simplex noise, unit vectors, etc.

All the methods are fully treeshakeable, so you will only bundle what you use.

- [**Basics**](#basics)
  - [`Random.bool()`](#randombool)
  - [`Random.float()`](#randomfloat)
  - [`Random.int()`](#randomint)
  - [`Random.pick()`](#randompick)
- [**Extras**](#extras)
  - [`Random.entry()`](#randomentry)
  - [`Random.index()`](#randomindex)
  - [`Random.noise()`](#randomnoise)
  - [`Random.random()`](#randomrandom)
  - [`Random.sample()`](#randomsample)
  - [`Random.sign()`](#randomsign)
  - [`Random.vector()`](#randomvector)
- [**Utils**](#utils)
  - [`Random.fork()`](#randomfork)
  - [`Random.seed()`](#randomseed)

## Basics

These are your basic random generator methods that you'll use most often—generating booleans, generating numbers, and picking elements from arrays.

### `Random.bool()`

```ts
Random.bool(probability?: number) => boolean
```

Generate a random boolean with a `probability` of being `true`, defaulting to 50%.

```ts
// Generate a random boolean with a `50%` chance of being true.
let a = Random.bool()

// Generate a random boolean with a `25%` chance of being true.
let b = Random.bool(0.25)
```

### `Random.float()`

```ts
Random.float() => number
Random.float(min?: number, max: number, step?: number) => number
```

Generate a random floating-point number, between `min` and `max`, with optional `step` increment. The `min` arguments defaults to `0` and the `max` argument defaults to `1`.

Note that when you do not specify a `step` argument that `max` argument is _exclusive_, similar to the built-in `Math.random()` method. But since it uses
extremely small decimal increments, it's often effectively used as inclusive. When you specify a `step` the `max` is inclusive, because that's most often the desired behavior, and matches [`Random.int()`](#randomint).

```ts
// Generate a random decimal between `0` (inclusive) and `1` (exclusive).
let r = Random.float()

// Generate a random decimal between `0` (inclusive) and `7` (exclusive).
let r = Random.float(7)

// Generate a random decimal between `5` (inclusive) and `10` (inclusive) in
// increments of `0.1`.
let r = Random.float(5, 10, 0.1)
```

### `Random.int()`

```ts
Random.int() => number
Random.int(min?: number, max: number, step?: number) => number
```

Generate a random integer, between `min` and `max`, with optional `step` increment. The `min` arguments defaults to `0` and the `max` argument defaults to `Number.MAX_SAFE_INTEGER`.

Note that all `Random.int()` arguments are _inclusive_. If you're looking for an easy way to get an index from an array, look at [`Random.index()`](), [`Random.pick`]() or [`Random.entry`]().

```ts
// Generate a random decimal between `0` (inclusive) and
// `Number.MAX_SAFE_INTEGER` (inclusive).
let r = Random.int()

// Generate a random decimal between `0` (inclusive) and `7` (inclusive).
let r = Random.int(7)

// Generate a random decimal between `5` (inclusive) and `10` (inclusive) in
// increments of `0.1`.
let r = Random.int(5, 10, 0.1)
```

### `Random.pick()`

```ts
Random.pick<T>(choices: T[], weights?: number[]) => T
```

Pick a random choice from an array of `choices`.

You can pass an array of `weights` numbers as the second argument, which will determine the probability of choosing each element in the array. The weights don't need to add up to `1`, they're relative.

```ts
// Pick a random color.
let color = Random.pick(['red', 'yellow', 'green', 'blue'])

// Pick a random color, with red having double the chance of being picked.
let color = Random.pick(['red', 'yellow', 'green', 'blue'], [2, 1, 1, 1])
```

## Extras

These are more specific randomness generators for specific use cases, to make your code easier to read at a glance.

### `Random.entry()`

```ts
Random.entry<T>(array: T[]) => [number, T]
Random.entry<T>(object: Record<string, T>) => [string, T]
Random.entry<K, V>(map: Map<K, V>) => [K, V]
Ranodm.entry<T>(map: Set<T>) => [T, T]
```

Similar to [`Random.pick()`](#randompick) or [`Random.index()`](#randomindex) but picks a random index _and_ element from a collection and returns them as a tuple.

The collection can be an `Array`, an `Object`, a `Map`, or a `Set`.

```ts
// Pick a random array entry.
let [index, color] = Random.entry(['red', 'yellow', 'green', 'blue'])

// Pick a random object entry.
let [key, hex] = Random.entry({
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
})
```

### `Random.index()`

```ts
Random.index(array: any[]) => number
```

Get a random index from an `array`.

If you want both the index and the element, see [`Random.entry()`](#randomentry).

```ts
let values = ['a', 'b', 'c']
let i = Random.index(values)
let v = values[i]
```

### `Random.noise()`

```ts
Random.noise(x?: number, y?: number, z?: number, w?: number) => number
```

Generate random [Simplex noise](https://en.wikipedia.org/wiki/Simplex_noise) value between `-1` and `1` in up to 4 dimensions.

```ts
let [x, y] = vector
let n = Random.noise(x, y)
```

### `Random.random()`

```ts
Random.random() => number
```

Generates a random number between `0` (inclusive) up to `1` (exclusive), just like the native `Math.random` function.

This is the function that all other randomness helpers call under the covers. It's usually better to use [`Random.float`](#randomfloat) in your sketches, but this helper is here because sometimes libraries will ask for a function that implements the same interface as `Math.random` as an argument, and this is it.

```ts
import { createNoise } from 'custom-noise'

let noiseFn = createNoise(Random.random)
```

### `Random.sample()`

```ts
Random.sample<T>(size: number, choices: T[]) => T
```

Returns a random sample of `size` from an array of `choices`. This is similar to [`Random.pick()`](#randompick) except it returns multiple picked values as an array, and the values won't repeat.

```ts
let colors = Random.sample(3, ['red', 'green', 'blue', 'yellow', 'black'])
// ['blue', 'black', 'red']
```

### `Random.sign()`

```ts
Random.sign() => -1 | 1
```

Generate a random sign of either `-1` or `1`.

Useful when you want to create take a variable and apply it as either itself or the negative version of itself.

```ts
let angle = 90 * Random.sign()
```

### `Random.vector()`

```ts
Random.vector(length: number) => [number, number, ...]
```

Generator a random unit vector of `length`.

```ts
let magnitude = 50
let direction = Random.vector() * magnitude
```

## Utils

These are a handful of utility methods that make working with randomness easier.

### `Random.fork()`

```ts
Random.fork<T>(callback: () => T) => T
```

Runs a `callback` function with a fork of the current random seed, so that you can call any number of random generator functions inside the callback and still only consume a single iteration of your seed.

This is helpful in situations where you want to conditionally do some logic that requires randomness, but you don't want random values _after_ that logic to remain deterministic.

```ts
let count = Random.int(1, 4)
let booleans = []

// Without this fork wrapper, the loop inside this function would have ticked
// the random seed forward between `1` and `4` times. But with the fork, it
// only ticks forward once, so any random values after it remain deterministic.
Random.fork(() => {
  for (let i = 0; i < count; i++) {
    booleans.push(Random.bool())
  }
})

// Because of the fork above, this boolean stays deterministic.
let after = Random.bool()
```

### `Random.seed()`

```ts
Random.seed(prng: () => number) => void
Random.seed<T>(prng: () => number, callback: () => T) => T
```

Sets the pseudo-random number generator used under the covers to a new `prng` function, which conforms to the `Math.random` interface.

If you pass a `callback`, it will be called immediately and the `prng` will only be used for its execution, and restored after that. So this provides an easy way to call a function with deterministic randomness.

```ts
let seed = 483903481
let myPrng = new MyPrng(seed)
Random.seed(myPrng, () => {
  let b = Random.bool()
  let i = Random.int(0, 34)
  // ...
})
```
