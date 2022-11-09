import { Void } from 'void'

// https://p5js.org/examples/interaction-follow-3.html
export default function () {
  let { width, height } = Void.settings()
  let segments = Void.int('segments', 5, 20)
  let length = Void.int('length', 20, 50, 10)
  let pointer = Void.pointer()
  let points: [number, number][] = Array.from({ length: segments }, () => [
    0, 0,
  ])

  let ctx = Void.layer()
  ctx.fillStyle = 'black'
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'
  ctx.lineWidth = 9
  ctx.lineCap = 'round'
  ctx.fillRect(0, 0, width, height)

  Void.draw(() => {
    if (!pointer.point) return
    ctx.fillRect(0, 0, width, height)
    for (let [i, point] of points.entries()) {
      let prev = i === 0 ? pointer.point : points[i - 1]
      let [px, py] = prev
      let [x, y] = point
      let dx = px - x
      let dy = py - y
      let angle = Math.atan2(dy, dx)
      let nx = (point[0] = px - Math.cos(angle) * length)
      let ny = (point[1] = py - Math.sin(angle) * length)
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
