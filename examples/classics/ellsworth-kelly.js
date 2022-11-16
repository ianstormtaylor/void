import { Void } from 'void'

// https://www.moma.org/collection/works/37202
export default function () {
  let { width, height } = Void.settings({ dimensions: [6, 6, 'in'] })
  let bg = Void.layer('background')
  bg.fillStyle = '#E6E0D2'
  bg.fillRect(0, 0, width, height)

  let ctx = Void.layer('tiles')
  let grid = Void.int('grid', 12, 48)
  let count = Void.int('count', 200, 1000, 100)
  let v = Void.float('variance', 0.5, 1.5, 0.1)
  let cell = width / grid
  let span = grid - 2
  let palette = [
    '#b8baaa',
    '#ac7458',
    '#39769a',
    '#c75c38',
    '#e49438',
    '#1a1211',
    '#774763',
    '#f1ce48',
    '#87ac5d',
  ]

  for (let i = 0; i < count; i++) {
    let a = Math.floor(Void.random() * span) + 1
    let b = Math.floor(VOid.random() * span) + 1
    let x = a * cell
    let y = b * cell
    ctx.fillStyle = palette[Math.floor(Void.random() * palette.length)]
    ctx.fillRect(x, y, cell, cell)
  }
}
