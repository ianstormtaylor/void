import { Random, Void } from 'void'

export default function () {
  let rows = Void.int('rows', 3, 7)
  let cols = Void.int('cols', 3, 7)
  let focus = Void.pick('focus', [3, 5, 6, 12, 18])
  let cell = 60
  let directions = [-1, 0, 1]

  let { width, height } = Void.settings({
    dimensions: [rows * cell, cols * cell, 'mm'],
    margin: [cell / 2, 'mm'],
  })

  let ctx = Void.layer()

  for (let x = 0; x < width; x += cell) {
    for (let y = 0; y < height; y += cell) {
      let size = cell
      let top = x
      let left = y
      let steps = Random.int(1, 8)
      let step = (size - focus) / steps
      let xdir = Random.pick(directions)
      let ydir = Random.pick(directions)
      while (size >= focus) {
        ctx.strokeRect(top, left, size, size)
        top += step / 2 + (step / 4) * xdir
        left += step / 2 + (step / 4) * ydir
        size -= step
      }
    }
  }
}
