import { Void } from 'void'

// https://pratiques-picturales.net/article63.html
// https://display.org.es/en/work/forms
// https://opheliaming.medium.com/vera-moln%C3%A1r-the-computer-art-goddess-26a84efbea4b
// https://trendland.com/art-paris-2014/
export default function () {
  let { width } = Void.settings({
    dimensions: [36, 36, 'cm'],
    margin: [3, 'cm'],
  })

  let grid = Void.int('grid', 10, 50, 5)
  let cell = width / grid
  let half = cell / 2
  let positions = [[0.5], [0.2, 0.8], [0.1, 0.5, 0.9]]

  let ctx = Void.layer()
  ctx.lineWidth = 0.1
  ctx.lineCap = 'round'

  for (let col = 0; col < grid; col++) {
    for (let row = 0; row < grid; row++) {
      let x = col * cell
      let y = row * cell
      let a = Void.random(0, Math.PI * 2)
      let i = Math.floor((row / grid) * positions.length)
      let ps = positions[i]

      ctx.save()
      ctx.translate(x + half, y + half)
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
