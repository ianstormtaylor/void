import { Void } from 'void'

export default function () {
  // Setup our canvas with specific dimensions.
  let { width, height } = Void.settings([300, 300, 'px'])

  // Define a trait that controls the radius of the circle.
  let radius = Void.int('radius', 10, 150)

  // Create a new layer to draw on.
  let ctx = Void.layer()

  // Draw a circle in the middle of the canvas.
  ctx.beginPath()
  ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2, false)
  ctx.fill()
}
