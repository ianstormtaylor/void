<p align="center">
  <img src="./docs/images/recording.gif" />
</p>
<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./docs/images/banner-dark.png">
    <img alt="The Void logo." src="./docs/images/banner-light.png">
  </picture>
</p>
<p align="center">
  A toolkit for generative art.
</p>

<br/>

<p align="center">
  <a href="#usage">Features</a> •
  <a href="#usage">Introduction</a> •
  <a href="#examples">Examples</a> •
  <a href="#documentation">Documentation</a>
</p>

<br/>

### Features

Void makes it easy to quickly explore ideas while creating generative art. It gives you tools you've come to expect from graphics editing programs:

- **Tweak variables.** Variables that you can tweak directly via the UI, so you can quickly test out variations of a sketch.

- **Seed randomness.** Every sketch is run with a seeded pseudo-random number generator, so outputs are 100% reproducible.

- **Export artwork.** You can export to common targets like `.png`, `.jpg`, and even `.svg`! Void can transform your `<canvas>` commands into SVG elements under the covers.

- **Define layouts.** Size your canvas in pixels, inches, centimeters, whatever. Choose from presets like `Letter`, `A4`, `1080p`, fullscreen, and more. Add margins or change orientations without having to do calculations yourself.

- **Feel familiar.** The interface was inspired by modern graphics apps like [Figma](https://www.figma.com/) and [Blender](https://www.blender.org/). And the API was inspired by creative coding frameworks like [P5.js](https://p5js.org/) and [canvas-sketch](https://github.com/mattdesl/canvas-sketch). If you've used any of those, Void should feel familiar.

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

And finally, open the sketch file with the Void app:

![A screenshot of the basic sketch in the Void app.](./docs/images/introduction.png)

If you see a black circle on the screen, congrats!

The <kbd>Radius</kbd> trait has a randomly generated value. You can change it in the sidebar and the sketch will update in realtime. This is a simple sketch that draws just one shape, but you can do a lot more…

<br/>

### Examples

Void is designed to make it easy to quickly iterate on sketches, so you can explore new ideas quickly. To get a sense for what's possible, here are some examples:

- **Basics**
  - [Introduction](./examples/introduction.js)
  - [Layers](./examples/layers.js)
  - [Noise](./examples/noise.js)
  - [Animation](./examples/animation.js)
  - [Pointer](./examples/pointer.js)
- **Classics**
  - [Bill Kolomyjec](./examples/classics/bill-kolomyjec.js)
  - [Ellsworth Kelly](./examples/classics/ellsworth-kelly.js)
  - [François Morellet](./examples/classics/francois-morellet.js)
  - [Georg Nees](./examples/classics/georg-nees.js)
  - [Vera Molnár](./examples/classics/vera-molnar.js)

<br/>

### Documentation

Void's API is designed to be extremely simple to use. It gives you a handful of tools that are useful when making generative art, and it delegates the rendering itself to the HTML [`<canvas>`](https://www.google.com/search?client=firefox-b-1-d&q=mdn+canvas) element

It's built as a series of helpers:

- [**Void**](./docs/void.md)
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
- [**Random**](./docs/void.md#random)
  - [`Void.random()`](./docs/void.md#voidrandom)

<br/>

### License

Void is 100% open-source and [MIT-licensed](./License.md). Any and all contributions are very welcome!
