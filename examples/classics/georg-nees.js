import { Void } from 'void'

export default function () {
  let { width, height } = Void.settings({
    dimensions: [4, 7, 'in'],
    margin: [0.25, 'in'],
    units: 'pt',
  })

  let ctx = Void.layer()
  let cols = Void.int('columns', 4, 16)
  let disp = Void.int('displacement', 0, 25)
  let rot = Void.int('rotation', 0, 180, 30) * (Math.PI / 180)
  let cell = width / cols
  let half = cell / 2

  for (let x = 0; x < width; x += cell) {
    for (let y = 0; y < height - cell; y += cell) {
      let t = Math.max(y / height, 0.07) ** 1.5
      let angle = t * Void.random(-rot, rot)
      let ox = t * Void.random(-disp, disp)
      let oy = t * Void.random(-disp, disp)
      ctx.save()
      ctx.translate(x + ox + half, y + oy + half)
      ctx.rotate(angle)
      ctx.translate(-half, -half)
      ctx.strokeRect(0, 0, cell, cell)
      ctx.restore()
    }
  }
}
