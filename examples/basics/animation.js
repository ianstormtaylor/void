import { Void } from 'void'

export default function () {
  // Get the canvas's dimensions and setup some variables.
  let { width, height } = Void.settings()
  let y = 0

  // Define a `speed` trait that will control how fact our line moves.
  let speed = Void.int('speed', 1, 11)

  // Create a layer to draw on, and fill it with black.
  let context = Void.layer()
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
