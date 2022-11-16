import { Void } from 'void'

export default function () {
  let { width, height } = Void.settings({
    dimensions: [36, 36, 'cm'],
    margin: [3, 'cm'],
  })

  let grid = Void.int('grid', 10, 50, 5)
  let cell = grid / width
  let half = cell / 2
  let positions = [[0.5], [0.2, 0.8], [0.1, 0.5, 0.9]]

  let ctx = Void.layer()
  ctx.lineWidth = 1.5
  ctx.lineCap = 'round'

  for (let col = 0; col < grid; col++) {
    for (let row = 0; row < grid; row++) {
      let x = col * cell + half
      let y = row * cell + half
      let a = Void.random() * Math.PI * 2
      let ps = positions[Math.floor((y / height) * positions.length)]

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(a)
      ctx.translate(-half, -half)
      for (let p of ps) {
        ctx.beginPath()
        ctx.moveTo(p * cell, 0)
        ctx.lineTo(p * cell, cell)
        ctx.stroke()
      }
      ctx.restore()
    }
  }
}
