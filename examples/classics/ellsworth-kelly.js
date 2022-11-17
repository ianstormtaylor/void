import { Void } from 'void'

// https://www.moma.org/collection/works/35484
export default function () {
  let { width, height } = Void.settings({ dimensions: [36, 36, 'in'] })
  let bg = Void.layer('background')
  bg.fillStyle = '#393939'
  bg.fillRect(0, 0, width, height)

  let ctx = Void.layer('tiles')
  let grid = Void.int('grid', 12, 36)
  let count = Void.int('count', 200, 1000, 200)
  let cell = width / grid
  let palette = [
    '#D4AB97',
    '#A2A757',
    '#2E3580',
    '#95393E',
    '#DAC34F',
    '#86A2BA',
    '#654470',
    '#BE6C22',
    '#4053A3',
    '#BE4E39',
    '#D79500',
    '#C7C796',
    '#394E5F',
    '#C4BEBE',
    '#7A9A82',
  ]

  for (let i = 0; i < count; i++) {
    let x = Void.random(0, grid, 1) * cell
    let y = Void.random(0, grid, 1) * cell
    ctx.fillStyle = palette[Math.floor(Void.random() * palette.length)]
    ctx.fillRect(x, y, cell, cell)
  }
}
