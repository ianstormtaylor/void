import { Void, Random } from 'void'
import * as scales from 'd3-scale-chromatic'

// https://p5js.org/examples/interaction-follow-3.html
// https://www.youtube.com/watch?v=sEKNoWyKUA0
export default function () {
  let { width, height } = Void.settings()
  let pointer = Void.pointer()
  let ctx = Void.layer()
  ctx.fillStyle = 'black'
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'
  ctx.lineWidth = 9
  ctx.lineCap = 'round'
  ctx.fillRect(0, 0, width, height)

  let points: [number, number][] = []
  let target: [number, number]

  Void.draw(() => {
    let segments = Void.int('segments', 5, 25)
    let length = Void.int('length', 15, 45, 5)
    let palette = Void.pick('palette', {
      skeletal: () => 'rgba(255,255,255,0.5)',
      plasma: scales.interpolatePlasma,
      piyg: scales.interpolatePiYG,
      cool: scales.interpolateCool,
      turbo: scales.interpolateTurbo,
    })

    target = pointer.point ?? target ?? [width / 2, height / 2]
    points = points.slice(0, segments)
    ctx.fillRect(0, 0, width, height)

    for (let i = 0; i < segments; i++) {
      let point = (points[i] ??= [
        Random.float(0, width),
        Random.float(0, height),
      ])
      let prev = i === 0 ? target : points[i - 1]
      let [px, py] = prev
      let [x, y] = point
      let angle = Math.atan2(py - y, px - x)
      let nx = (point[0] = px - Math.cos(angle) * length)
      let ny = (point[1] = py - Math.sin(angle) * length)
      let t = i / segments
      ctx.strokeStyle = palette(1 - t)
      ctx.save()
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
