import { Math, Random, Void } from 'void'

export default function () {
  let { width, height } = Void.settings({
    dimensions: [4, 7, 'in'],
    margin: [0.25, 'in'],
  })

  let ctx = Void.layer()
  let cols = Void.int('columns', 4, 16)
  let ease = Void.float('ease', 0, 2, 0.05)
  let disp = Void.int('displacement', 0, 50)
  let rot = Void.int('rotation', 0, 360, 30)
  let cell = width / cols
  let half = cell / 2

  for (let x = 0; x < width; x += cell) {
    for (let y = 0; y < height - cell; y += cell) {
      let t = Math.clamp(Math.easeOut(y / height, ease), 0.01, 1)
      let angle = t * Math.radians(Random.float(-rot, rot))
      let ox = t * Random.float(-disp, disp)
      let oy = t * Random.float(-disp, disp)
      ctx.save()
      ctx.translate(x + ox + half, y + oy + half)
      ctx.rotate(angle)
      ctx.translate(-half, -half)
      ctx.strokeRect(0, 0, cell, cell)
      ctx.restore()
    }
  }
}
