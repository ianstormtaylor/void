import { Random, Void } from 'void'

export default function () {
  let cell = Void.int('cell', 5, 20)
  let weight = Void.int('weight', 1, 5)
  let cap = Void.pick('cap', ['square', 'round', 'butt'])

  let { width, height } = Void.settings({
    dimensions: [8, 6, 'in'],
    margin: [0.25, 'in'],
  })

  let ctx = Void.layer('main')
  ctx.lineCap = cap
  ctx.lineWidth = weight

  for (var x = 0; x < width; x += cell) {
    for (var y = 0; y < height; y += cell) {
      ctx.beginPath()

      if (Random.bool()) {
        ctx.moveTo(x, y)
        ctx.lineTo(x + cell, y + cell)
      } else {
        ctx.moveTo(x + cell, y)
        ctx.lineTo(x, y + cell)
      }

      ctx.stroke()
    }
  }
}
