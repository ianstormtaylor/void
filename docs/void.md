# `Void`

The `Void` namespace contains the main methods you use to configure and control sketches in Void. You use them to setup your canvas, define custom traits, and hook up interactions.

- **Canvas**
  - [`Void.draw`](#voiddraw)
  - [`Void.layer`](#voidlayer)
  - [`Void.settings`](#voidsettings)
- **Traits**
  - [`Void.bool`](#voidbool)
  - [`Void.float`](#voidfloat)
  - [`Void.int`](#voidint)
  - [`Void.pick`](#voidpick)
- **Interaction**
  - [`Void.keyboard`](#voidkeyboard)
  - [`Void.pointer`](#voidpointer)
  - [`Void.event`](#voidevent)

## Canvas

The canvas methods help your setup up your sketch's layout and determine how you draw the output of your sketch.

- [`Void.draw`](#voiddraw)
- [`Void.layer`](#voidlayer)
- [`Void.settings`](#voidsettings)

### `Void.draw`

Defines the looping draw function for the sketch, which is called to render each new frame in an animation.

```ts
type draw = (callback: () => void) => void
```

```ts
Void.draw(() => {
  // Run your animation drawing logic here...
})
```

Note that you aren't _required_ to define a draw function. You could choose to draw everything in a single frame in the main function instead.

The drawing frame rate is determined by the `fps` option of [`Void.settings`](#settings).

### `Void.layer`

Creates a new layer in the sketch's canvas, on top of any previous layers.

```ts
type layer = (name?: string) => CanvasRenderingContext2D
```

```ts
// Create a new layer.
let bg = Void.layer()
bg.fillRect(50, 50, 100, 100)

// Create a new layer with a name that will show up in the interface.
let border = Void.layer('border')
border.stokeStyle = 'gray'
border.strokeRect(0, 0, width, height)
```

The returned value is a 2D [`context`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) object for the canvas. So you can use any of the familiar canvas methods like `fill`, `stroke`, `rect`, `arc`, etc.

The context is already pre-transformed so that it uses the units you've setup your sketch with from the [`Void.settings`](#settings) method. So if your canvas is `42 mm` in width, the context will also be `42` units wide.

The `name` argument is optional, and will be auto-incremented as `Layer {number}` if omitted.

### `Void.settings`

Configures the sketch and return a settings object that you can use to tailor your drawings to the width, height, frame rate, dpi, etc.

```ts
type settings = (dimensions: Size | [number, number, Units]) => { ... }
type settings = (options?: {
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

```ts
// Define a canvas that is the size of an A4 sheet of paper, with 4mm margins,
// in landscape orientation. And use those variables for drawing.
let { width, height, margin } = Void.settings({
  dimensions: 'A4',
  margin: [4, 'mm'],
  orientation: 'landscape',
})

// Define a canvas using the shorthand, that's 300 pixels square.
let { width, height } = Void.settings([300, 300, 'px'])

// Define a canvas that's 6 inches square, but using millimeters as the unit
// of measurement.
let { width, height, margin } = Void.settings({
  dimensions: [6, 6, 'in'],
  margin: [0.5, 'in'],
  units: 'mm',
})
```

The `dimensions` argument can either be a `[number, number, Units]` tuple, a screen size keyword (eg. `1080p`) or a paper size keyword (eg. `A4`).

If the `dimensions` option is omitted, the sketch will be fullscreen.

The `margin` option will be subtracted from the dimensions, and the `width` and `height` returned will have the margin already subtracted. This way you don't need to constantly do math to ensure your margins stay in place.

## Traits

Traits are special variables that you can define that will appear in the interface along with controls to tweak them. They let you quickly try different variations of ideas as your sketching.

- [`Void.bool`](#voidbool)
- [`Void.float`](#voidfloat)
- [`Void.int`](#voidint)
- [`Void.pick`](#voidpick)

### `Void.bool`

Defines a boolean trait for the sketch.

```ts
type bool = (name: string, default?: boolean) => boolean
```

```ts
// Define a boolean trait named "enabled", that is randomly generated.
let enabled = Void.bool('enabled')

// Define a boolean trait named "hidden", that defaults to `false`.
let hidden = Void.bool('hidden', true)
```

If you don't supply a default, the boolean will be randomly generated with a 50/50 chance of being `true`.

### `Void.float`

Defines a floating point number trait for the sketch.

```ts
type float = (name: string, default: number) => number
type float = (name: string, min: number, max: number, step?: number) => number
```

```ts
// Define a trait named "multiplier", that defaults to `0.5`.
let mul = Void.float('multiplier', 0.5)

// Define a trait named "ratio", that is randomly generated between `0` and
// `1`, in incrementing of `0.1`.
let ratio = Void.float('ratio', 0, 1, 0.1)
```

### `Void.int`

Defines an integer trait for the sketch.

```ts
type int = (name: string, default: number) => number
type int = (name: string, min: number, max: number, step?: number) => number
```

```ts
// Define a trait named "columns", that defaults to `12`.
let cols = Void.int('columns', 12)

// Define a trait named "angle", that is randomly generated between `0` and
// `360`.
let angle = Void.int('angle', 0, 360)
```

### `Void.pick`

Defines an enum trait for the sketch, choosing one of many values.

```ts
type pick<T> = (name: string, choices: T[] | Record<string, T>) => T
type pick<T> = (
  name: string,
  choices: [number, T][] | Record<string, [number, T]>
) => T
```

```ts
// Define a trait named "color", that is randomly chosen from a set of options.
let color = Void.pick('color', [
  '#b8baaa',
  '#ac7458',
  '#1a1211',
  '#f1ce48',
  '#87ac5d',
])

// Define a trait named "density", that is randomly chosen from a set of
// options each with a different weighted probability.
let density = Void.pick('density', [
  [3, 'compact'],
  [5, 'normal'],
  [1, 'sparse'],
])

// Define a trait "ease", that is randomly chosen from a set of functions.
let ease = Void.pick('ease', {
  bounce: (t) => { ... },
  linear: (t) => { ... },
  smooth: (t) => { ... },
  quad: (t) => { ... },
})
```

When defining weighted choices the weights do not need to add to `1`. They will be determined relative to the sum of all weight values.

## Interaction

These methods help manage user interaction while your sketch is running.

- [`Void.event`](#voidevent)
- [`Void.keyboard`](#voidkeyboard)
- [`Void.pointer`](#voidpointer)

### `Void.event`

Listens for a DOM event.

```ts
type event = (name: string, callback: (e: event) => void) => () => void
```

```ts
Void.event('dblclick', (e) => {
  // Do something special on double clicks…
})
```

This is the most flexible of the interaction methods, and lets you listen to any DOM events you'd like to create complex interactions.

The return value is an `unsubscribe` function which you can call if you want to stop listening at any point. However it will be automatically called when your sketch ends, so you don't need to worry about cleanup.

### `Void.keyboard`

Information about which keys are pressed on the keyboard.

```ts
type keyboard = () => {
  code: string | null
  codes: Record<string, true>
  key: string | null
  keys: Record<string, true>
}
```

```ts
let keyboard = Void.keyboard()
if (keyboard.keys.Space) {
  // Perform logic when the spacebar is down…
}
```

These properties are based on the DOM's [Keyboard events](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent).

- `code` - the [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) value of the key being pressed.
- `codes` - a dictionary with the [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) values for every key currently being pressed.
- `key` - the [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) value of the key being pressed.
- `keys` - a dictionary with the [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) values for every key currently being pressed.

These properties will reflect the key in question as long as it continues to be held down. So for example, you could make a sketch that drew in a different color each frame if the space bar was held down.

If you'd instead like to perform a single action when a key is first pressed, using the [`Void.event`](#event) method instead.

### `Void.pointer`

Information about where the pointer is (eg. mouse, stylus, finger) relative to the canvas, and which buttons are pressed.

```ts
type pointer = () => {
  type: 'mouse' | 'pen' | 'touch' | null
  x: number | null
  y: number | null
  position: [number, number] | null
  button: null | null
  buttons: Record<number, true>
}
```

```ts
let pointer = Void.pointer()
ctx.fillStyle = pointer.x > width / 2 ? 'red' : 'transparent'
```

These properties are based on the DOM's [Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent).

- `type` - the type of the pointer.
- `x` - the X-axis position of the pointer.
- `y` - the Y-axis position of the pointer.
- `position` - the position of the pointer as a vector tuple.
- `button` - a number representing the mouse/stylus button being pressed.
- `buttons` - a dictionary representing every mouse/stylus button currently being pressed.

All position-related properties are expressed in the same dimensions and units you setup your sketch to use, so you don't need to worry about converting the absolute values to relative units.
