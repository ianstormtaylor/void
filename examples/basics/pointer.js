import { Void, Random } from 'void'
import * as scales from 'd3-scale-chromatic'

// https://p5js.org/examples/interaction-follow-3.html
// https://www.youtube.com/watch?v=sEKNoWyKUA0
export default function () {
  // Get the dimensions of the fullscreen sketch.
  let { width, height } = Void.settings()

  // Define some traits that control our sketch's behavior.
  let segments = Void.int('segments', 5, 25)
  let length = Void.int('length', 15, 45, 5)
  let palette = Void.pick('palette', {
    skeletal: () => 'rgba(255,255,255,0.5)',
    plasma: scales.interpolatePlasma,
    piyg: scales.interpolatePiYG,
    cool: scales.interpolateCool,
    turbo: scales.interpolateTurbo,
  })

  // Get a reference to the pointer (eg. mouse or finger) as it moves.
  let pointer = Void.pointer()

  // Create a new layer to draw on.
  let ctx = Void.layer()
  ctx.lineWidth = 9
  ctx.lineCap = 'round'

  // Define a few variables to use for the sketch.
  let target = [width / 2, height / 2]
  let points = Array.from({ length: segments }, () => {
    return [Random.float(0, width), Random.float(0, height)]
  })

  // On every frame...
  Void.draw(() => {
    // Reset the canvas to be all black.
    ctx.fillRect(0, 0, width, height)

    // Use the latest pointer position as the target, or the previous one.
    target = pointer.position ?? target

    // Draw each segment of the chain, keeping the entire chain connected.
    for (let i = 0; i < segments; i++) {
      // Chain each new point to the previous point.
      let point = points[i]
      let prev = i === 0 ? target : points[i - 1]
      let [px, py] = prev
      let [x, y] = point
      let angle = Math.atan2(py - y, px - x)
      let nx = (point[0] = px - Math.cos(angle) * length)
      let ny = (point[1] = py - Math.sin(angle) * length)

      // Draw the segment.
      ctx.save()
      ctx.strokeStyle = palette(1 - i / segments)
      ctx.translate(nx, ny)
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(length, 0)
      ctx.stroke()
      ctx.restore()
    }
  })
}
