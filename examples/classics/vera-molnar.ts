import { Math, Random, Void } from 'void'

export default function () {
  let { width, height } = Void.settings({
    dimensions: [36, 36, 'cm'],
    margin: [3, 'cm'],
  })

  let grid = Void.int('grid', 10, 50, 5)
  let ctx = Void.layer('main')
  ctx.lineWidth = 1.5
  ctx.lineCap = 'round'

  for (let [x1, x2] of Math.split(0, width, grid)) {
    for (let [y1, y2] of Math.split(0, height, grid)) {
      let w = x2 - x1
      let h = y2 - y1
      let x = x1 + w / 2
      let y = y1 + h / 2
      let positions =
        y < height / 3
          ? [0.5]
          : y < (height * 2) / 3
          ? [0.2, 0.8]
          : [0.1, 0.5, 0.9]

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(Random.float(0, Math.TAU))
      ctx.translate(-w / 2, -h / 2)

      for (let p of positions) {
        ctx.beginPath()
        ctx.moveTo(p * w, 0)
        ctx.lineTo(p * w, h)
        ctx.stroke()
      }

      ctx.restore()
    }
  }
}
