# `Void`

```ts
import { Void } from 'void'
```

The `Void` namespace holds the tools you use to control a sketch. You use them to size your canvas, generate random values, define custom traits, and wire up interactions.

Void is fully treeshake-able, so you'll only bundle methods you use.

- [**Canvas**](#canvas)
  - [`Void.draw()`](#voiddraw)
  - [`Void.layer()`](#voidlayer)
  - [`Void.settings()`](#voidsettings)
- [**Traits**](#traits)
  - [`Void.bool()`](#voidbool)
  - [`Void.float()`](#voidfloat)
  - [`Void.int()`](#voidint)
  - [`Void.pick()`](#voidpick)
- [**Interaction**](#interaction)
  - [`Void.event()`](#voidevent)
  - [`Void.keyboard()`](#voidkeyboard)
  - [`Void.pointer()`](#voidpointer)
- [**Utils**](#utils)
  - [`Void.convert()`](#voidconvert)
  - [`Void.fork()`](#voidfork)
  - [`Void.random()`](#voidrandom)

## Canvas

The canvas methods setup your sketch's layout and determine how it's drawn.

### `Void.draw()`

```ts
Void.draw(callback: () => void) => void
```

Defines the function used to draw each frame in an animated sketch. You aren't _required_ to define a draw function. You could choose to draw everything in a single frame in the sketch's main function instead.

The drawing frame rate is determined by the `fps` option of [`Void.settings()`](#settings).

```ts
export default function () {
  let ctx = Void.layer()
  let x = 0
  let y = 0
  Void.draw(() => {
    ctx.fillRect(x, y, 100, 150)
    x += 5
    y += 10
  })
}
```

### `Void.layer()`

```ts
Void.layer(name?: string) => CanvasRenderingContext2D
```

Creates a new layer in the sketch's canvas, on top of any previous layers.

The returned value is a 2D [`context`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) object for the canvas with familiar canvas methods like `fill`, `stroke`, `rect`, `arc`, etc. The context is pre-transformed so that it uses the units you've set with [`Void.settings()`](#settings). So if your canvas is `42 mm` in width, the context will also be `42` units wide.

```ts
// Create a new layer.
let bg = Void.layer()
bg.fillRect(50, 50, 100, 100)

// Create a new layer with a name that will show up in the interface.
let border = Void.layer('border')
border.stokeStyle = 'gray'
border.strokeRect(0, 0, width, height)
```

### `Void.settings()`

```ts
Void.settings(dimensions: Size | [number, number, Units]) => { ... }
Void.settings(options?: {
  dimensions?: Size | [number, number, Units]
  dpi?: number
  fps?: number
  frames?: number
  margin?: [number, number?, number?, number?, Units]
  orientation?: 'portrait' | 'landscape' | 'square'
  precision?: [number, Units]
  units?: Units
}) => {
  dpi: number
  fps: number
  frames: number
  height: number
  margin: [number, number, number, number]
  precision: number
  units: Units
  width: number
}
```

Configures the sketch and return a settings object that you can use to tailor your drawings to the width, height, frame rate, dpi, etc.

The `dimensions` argument can either be a `[number, number, Units]` tuple, a screen size keyword (eg. `1080p`) or a paper size keyword (eg. `A4`). If omitted, the sketch will be fullscreen.

The `margin` option will be subtracted from `dimensions`, and the returned `width` and `height` will too. This way you don't need to be constantly accounting for the margins in calculations.

```ts
// Define a canvas that takes up all the available screen space.
let { width, height } = Void.settings()

// Define a canvas using the shorthand, that's 300 pixels square.
let { width, height } = Void.settings([300, 300, 'px'])

// Define a canvas that is the size of an A4 sheet of paper, with 4mm margins,
// in landscape orientation. And use those variables for drawing.
let { width, height, margin } = Void.settings({
  dimensions: 'A4',
  margin: [4, 'mm'],
  orientation: 'landscape',
})

// Define a canvas that's 6 inches square, but using millimeters as the unit
// of measurement.
let { width, height, margin } = Void.settings({
  dimensions: [6, 6, 'in'],
  margin: [0.5, 'in'],
  units: 'mm',
})
```

## Traits

Traits are special variables that you can define that will appear in the interface along with controls to tweak them. They let you quickly try different variations of ideas as your sketching.

### `Void.bool()`

```ts
Void.bool(name: string, initial?: boolean) => boolean
Void.bool(name: string, probability?: number) => boolean
```

Defines a boolean trait for the sketch.

If you don't supply an `initial` argument, the boolean will be randomly generated with a 50/50 chance of being `true`. You can change this by passing in a custom `probability` argument instead.

```ts
// Define a boolean trait named "hidden" initially set to `false`.
let hidden = Void.bool('hidden', true)

// Define a boolean trait named "enabled" that is randomly generated.
let enabled = Void.bool('enabled')

// The same "enabled" boolean, but with a 25% chance of being true.
let enabled = Void.bool('enabled', 0.25)
```

### `Void.float()`

```ts
Void.float(name: string, initial: number) => number
Void.float(name: string, min: number, max: number, step?: number) => number
```

Defines a floating point number trait for the sketch.

```ts
// Define a trait named "multiplier" initially set to `0.5`.
let mul = Void.float('multiplier', 0.5)

// Define a trait named "ratio" that is randomly generated between `0` and
// `1`, in increments of `0.1`.
let ratio = Void.float('ratio', 0, 1, 0.1)
```

### `Void.int()`

```ts
Void.int(name: string, initial: number) => number
Void.int(name: string, min: number, max: number, step?: number) => number
```

Defines an integer trait for the sketch.

```ts
// Define a trait named "columns" initially set to `12`.
let cols = Void.int('columns', 12)

// Define a trait named "angle" that is randomly generated between `0` and `360`.
let angle = Void.int('angle', 0, 360)
```

### `Void.pick()`

```ts
Void.pick<T>(
  name: string,
  initial?: string,
  choices: T[] | [number, T][] | Record<string, T> | Record<string, [number, T]>
) => T
```

Defines an enum trait for the sketch, choosing one of many values.

When defining weighted choices the weights do not need to add to `1`. They will be determined relative to the sum of all weight values.

```ts
// Define a trait named "color" that is randomly chosen from a set of options.
let color = Void.pick('color', [
  '#b8baaa',
  '#ac7458',
  '#1a1211',
  '#f1ce48',
  '#87ac5d',
])

// The same "color" trait from above, but each of the choices has a weight
// associated with it, determining the probably with which it'll be chosen.
let color = Void.pick('color', [
  [1, '#b8baaa'],
  [3, '#ac7458'],
  [2, '#1a1211'],
  [5, '#f1ce48'],
  [2, '#87ac5d'],
])

// Define a trait "ease" that is randomly chosen from a set of functions.
let ease = Void.pick('ease', {
  bounce: (t) => { ... },
  linear: (t) => { ... },
  smooth: (t) => { ... },
  quad: (t) => { ... },
})

// Define a trait named "density" initially set to "normal", but that can be
// changed to one of three values.
let density = Void.pick('density', 'normal', [
  'compact',
  'normal',
  'sparse',
])
```

## Interaction

These methods help manage user interaction while your sketch is running.

### `Void.event()`

```ts
Void.event(type: string, callback: (e: event) => void) => () => void
```

Listens for a DOM event of `type`. This is the most flexible of the interaction methods, and lets you listen to any DOM events you'd like to create complex interactions.

The return value is an `unsubscribe` function which you can call if you want to stop listening at any point. However it will be automatically called when your sketch ends, so you don't need to worry about cleanup.

```ts
Void.event('dblclick', (e) => {
  ctx.lineWidth++
})
```

### `Void.keyboard()`

```ts
Void.keyboard() => {
  code: string | null
  codes: Record<string, true>
  key: string | null
  keys: Record<string, true>
}
```

Information about which keys are pressed on the keyboard, based on the DOM's [Keyboard events](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent).

- `code` - the [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) value of the key being pressed.
- `codes` - a dictionary with the [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) values for every key currently being pressed.
- `key` - the [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) value of the key being pressed.
- `keys` - a dictionary with the [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) values for every key currently being pressed.

These properties will reflect the key in question as long as it continues to be held down. So for example, you could make a sketch that drew in a different color each frame if the space bar was held down.

If you'd instead like to perform a single action when a key is first pressed, using the [`Void.event()`](#event) method instead.

```ts
let keyboard = Void.keyboard()
ctx.fillStyle = keyboard.keys.Enter ? 'red' : 'black'
```

### `Void.pointer()`

```ts
Void.pointer() => {
  type: 'mouse' | 'pen' | 'touch' | null
  x: number | null
  y: number | null
  position: [number, number] | null
  button: number | null
  buttons: Record<number, true>
}
```

Information about where the pointer is (eg. mouse, stylus, finger) relative to the canvas, and which buttons are pressed, based on the DOM's [Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent).

- `type` - the type of the pointer.
- `x` - the X-axis position of the pointer.
- `y` - the Y-axis position of the pointer.
- `position` - the position of the pointer as a vector tuple.
- `button` - a number representing the mouse/stylus [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button) being pressed.
- `buttons` - a dictionary representing every mouse/stylus [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button) currently being pressed.

All position-related properties are expressed in the same dimensions and units you setup your sketch to use, so you don't need to worry about converting the absolute values to relative units.

```ts
let pointer = Void.pointer()
ctx.fillStyle = pointer.x > width / 2 ? 'red' : 'transparent'
```

## Utils

### `Void.convert()`

```ts
Void.convert(x: number, from: Units, to?: Units, options?: {
  dpi?: number
  precision?: number
}) => number
```

Converts a value `x` defined in `from` units to the equivalent in `to` units.

When the `to` argument is omitted, Void will default it to the units of the current canvas. So this gives you an easy way to quickly get canvas-relative units from real-world ones.

```ts
// Set the line width to 4 millimeters, regardless of canvas resolution.
ctx.lineWidth = Void.convert(4, 'mm')
```

### `Void.fork()`

```ts
Void.fork<T>(callback: () => T) => T
```

Runs a `callback` function with a fork of the current random seed, so that you can retrieve any amount of random numbers inside the callback and still only consume a single iteration of your seed.

This is helpful in situations where you want to conditionally do some logic that requires randomness, but you want random values _after_ that logic to remain deterministic.

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

### `Void.random()`

```ts
Void.random() => number
Void.random(min: number, max: number, step?: number) => number
```

Returns a random number, by default from `0` (inclusive) to `1` (exclusive).

This is just like `Math.random` except that the randomness is determined by the sketch's seed value, so the same values will be produced every time for the same seed.

You can also pass the `min`, `max`, and optional `step` arguments to have the result in a different range, and optionally rounded to that step multiple. Both `min` and `max` are inclusive when a `step` is provided. (Without a step technically `max` is exclusive, but the increments are so small that that's usually an implementation detail.)

```ts
Void.random()
// 0.384037...

Void.random(0, 5)
// 2.084939...

Void.random(1, 7, 1)
// 3

Void.random(-1, 1, 0.5)
// -0.5
```
