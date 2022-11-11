# Welcome to Void

Void is a toolkit for generative art.

You can use it to explore ideas, create artwork, build simulations, or anything else where you want a canvas, some variables, and a nice app to edit them in.

## Sketches

Void is based around sketches, which are files that export a function as their default export, and render some things on the screen.

Here's the simplest sketch:

```ts
// Import the void library.
import { Void } from 'void'

// Export the sketch function as the module's default export.
export default function () {
  // Create a new canvas layer.
  let ctx = Void.layer()
  // Draw a rectangle on the canvas.
  ctx.fillRect(50, 50, 100, 100)
}
```

If you're familiar with HTML Canvas, that should look familiar.

# Getting Started

To get started, download the Void desktop app:

![]()

And install the `void` package:

```bash
npm install --save void
```

```bash
yarn add void
```

Then create a new sketch file:

```ts
import { Void } from 'void'

export default function () {
  let ctx = Void.layer()
  ctx.fillRect(50, 50, 100, 100)
}
```

And finally, open the sketch with the Void app:

![]()

If you see a black rectangle on the screen, congrats!

That is the simplest sketch you can create with Void, with just a single shape on a fullscreen canvas, but you can do a lot more.

# Examples

Void is designed to make it easy to quickly iterate on sketches, while also giving you the power to visually change the settings. So you get instant feedback as you try new ideas.

To get a sense for what's possible, here some of the examples:

- **Basics**
  1. [Basic](./examples/basic.js)
  2. [Layers](./examples/layers.js)
  3. [Animation](./examples/animation.js)
  4. [Pointer](./examples/pointer.js)
- **Classics**
  - [Ellsworth Kelly](./examples/classics/ellsworth-kelly.js)
  - [Francois Morellet](./examples/classics/francois-morellet.js)

# Docs
