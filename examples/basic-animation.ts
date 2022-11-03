import { Void } from 'void'

// A basic animation example sketch.
export default function () {
  // Setup our layout, traits, and variables.
  let { width, height } = Void.settings()
  let speed = Void.int('speed', 1, 11)
  let y = 0

  // Create a layer to draw on, and fill it with black.
  let context = Void.layer('main')
  context.fillStyle = 'black'
  context.fillRect(0, 0, width, height)

  // On each frame…
  Void.draw(() => {
    // Fade the previous frame slightly more towards black.
    context.fillStyle = 'rgba(0, 0, 0, 0.25)'
    context.fillRect(0, 0, width, height)

    // Draw a new horizontal line.
    context.strokeStyle = 'gray'
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(width, y)
    context.stroke()

    // Move downward, and wrap back to the top.
    y = y >= height ? 0 : y + speed
  })
}
