<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/images/banner-dark.png">
    <img alt="The Void logo." src="./docs/images/banner-light.png">
  </picture>
</p>
<p align="center">
  A toolkit for generative art.
</p>
<p align="center">
  <a href="#introduction">Introduction</a> •
  <a href="#examples">Examples</a> •
  <a href="#documentation">Documentation</a>
</p>
<br/>

Void makes it easy to create and explore generative art. It gives you the workflows you've come to expect from modern graphics programs, paired with a simple, powerful library for building sketches based on [HTML's `<canvas>`](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

- **Tweak variables.** The traits of a sketch can be changed directly in the UI, so you can experiment quickly, and create a variety of different outputs.

- **Export artwork.** The output of a sketch can be exported to raster formats like PNG or JPG, as well as vector formats like SVG out of the box!

- **Control randomness.** Changing the random seed for a sketch allows you to reproduce existing outputs, or create entirely new outputs.

- **Customize layout.** Use common presets like `Letter`, `A4`, or `1080p`, or define a custom size, add margins, change orientations, etc.

- **Import dependencies.** Sketches are just JavaScript (or TypeScript) files, so you can import useful helpers from [npm](https://www.npmjs.com/) packages or neighboring files as usual.

- **Bundle efficiently.** The Void library is designed to be completely treeshake-able, so it produces the absolute smallest bundle sizes when packaging up your code.

- **Feel familiar.** Void's UI is inspired by modern tools like [Figma](https://www.figma.com/) and [Blender](https://www.blender.org/), its API is inspired by creative coding frameworks like [P5.js](https://p5js.org/) and [canvas-sketch](https://github.com/mattdesl/canvas-sketch).

<br/>
<p align="center">
  <img src="./docs/images/recording.gif" />
</p>
<br/>

### Introduction

To get started, download the Void desktop app:

<img width="131" height="43" alt="Download the Void desktop app." src="./docs/images/download.png" />

Install the `void` package:

```bash
npm install --save void
```

Create a new sketch file:

```js
import { Void } from 'void'

export default function () {
  let { width, height } = Void.settings([300, 300, 'px'])
  let radius = Void.int('radius', 10, 150)
  let ctx = Void.layer()
  ctx.beginPath()
  ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2, false)
  ctx.fill()
}
```

Then open the sketch file with the Void app:

![A screenshot of the basic sketch in the Void app.](./docs/images/introduction.png)

If you see a black circle on the screen, congrats!

The <kbd>Radius</kbd> trait has a randomly generated value. You can change it in the sidebar and the sketch will update in real time. This is a simple sketch that draws just one shape, but you can do a lot more…

<br/>

### Examples

Void is designed to make it easy to quickly iterate on sketches, so you can explore new ideas quickly. To get a sense for what's possible, here are some examples:

- **Basics**
  - [Introduction](./examples/basics/introduction.js)
  - [Layers](./examples/basics/layers.js)
  - [Noise](./examples/basics/noise.js)
  - [Animation](./examples/basics/animation.js)
  - [Pointer](./examples/basics/pointer.js)
- **Classics**
  - [Bill Kolomyjec](./examples/classics/bill-kolomyjec.js)
  - [Ellsworth Kelly](./examples/classics/ellsworth-kelly.js)
  - [François Morellet](./examples/classics/francois-morellet.js)
  - [Georg Nees](./examples/classics/georg-nees.js)
  - [Vera Molnár](./examples/classics/vera-molnar.js)

<br/>

### Documentation

Void's API is designed to be extremely simple to use. It gives you a handful of tools that are useful when making generative art, and it delegates the rendering itself to the HTML [`<canvas>`](https://www.google.com/search?client=firefox-b-1-d&q=mdn+canvas) element.

It's built as a series of helper functions:

- [**Canvas**](./docs/void.md#canvas)
  - [`Void.draw()`](./docs/void.md#voiddraw)
  - [`Void.layer()`](./docs/void.md#voidlayer)
  - [`Void.settings()`](./docs/void.md#voidsettings)
- [**Traits**](./docs/void.md#traits)
  - [`Void.bool()`](./docs/void.md#voidbool)
  - [`Void.float()`](./docs/void.md#voidfloat)
  - [`Void.int()`](./docs/void.md#voidint)
  - [`Void.pick()`](./docs/void.md#voidpick)
- [**Interaction**](./docs/void.md#interaction)
  - [`Void.event()`](./docs/void.md#voidevent)
  - [`Void.keyboard()`](./docs/void.md#voidkeyboard)
  - [`Void.pointer()`](./docs/void.md#voidpointer)
- [**Utils**](./docs/void.md#utils)
  - [`Void.convert()`](./docs/void.md#voidconvert)
  - [`Void.fork()`](./docs/void.md#voidfork)
  - [`Void.random()`](./docs/void.md#voidrandom)

<br/>

### License

Void is open-source and [MIT-licensed](./License.md). If you run into issues or think of improvements, all contributions are very welcome! Feel free to [open an issue](https://github.com/ianstormtaylor/void/issues) or [submit a pull request](https://github.com/ianstormtaylor/void/pulls).
