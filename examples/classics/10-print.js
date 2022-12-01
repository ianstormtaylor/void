import { Void } from 'void'

export default function () {
  let cell = Void.float('cell', 0.1, 1, 0.1)
  let weight = Void.float('weight', 0.01, 0.07, 0.01)
  let cap = Void.pick('cap', ['square', 'round', 'butt'])

  let { width, height } = Void.settings({
    dimensions: [8, 6, 'in'],
    margin: [0.25, 'in'],
  })

  let ctx = Void.layer()
  ctx.lineCap = cap
  ctx.lineWidth = weight

  for (var x = 0; x < width; x += cell) {
    for (var y = 0; y < height; y += cell) {
      ctx.beginPath()
      if (Void.random() < 0.5) {
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
