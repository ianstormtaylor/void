import { Void } from 'void'

// https://www.wikiart.org/en/francois-morellet/tirets-neon-0-90-avec-4-rythmes-interferents-1971
export default function () {
  let grid = Void.pick('grid', [3, 5, 7])
  let { width, height } = Void.settings({
    dimensions: [500, 500, 'px'],
    fps: 2,
  })

  let bg = Void.layer('background')
  bg.fillStyle = '#111111'
  bg.fillRect(0, 0, width, height)

  let offs = Void.layer('offs')
  offs.lineWidth = 1
  offs.strokeStyle = 'rgb(75,50,50)'

  let ons = Void.layer('ons')
  ons.lineWidth = 3
  ons.strokeStyle = 'rgb(255,50,50)'
  ons.lineCap = 'round'
  ons.shadowColor = 'rgb(255,0,0)'
  ons.shadowBlur = 10

  let padding = width * 0.025
  let cell = (width - padding * 2) / grid
  let edges = [0, 1, 2, 3]
  let boxes = []

  for (let col = 0; col < grid; col++) {
    for (let row = 0; row < grid; row++) {
      let x = padding + col * cell
      let y = padding + row * cell
      boxes.push([
        [x, y],
        [x, y + cell],
        [x + cell, y + cell],
        [x + cell, y],
      ])
    }
  }

  Void.draw(() => {
    ons.clearRect(0, 0, width, height)
    offs.clearRect(0, 0, width, height)

    let highlights = edges
      .slice()
      .sort(() => 0.5 - Void.random())
      .slice(0, 2)

    for (let [i, box] of boxes.entries()) {
      let h = highlights.at(i % highlights.length)

      for (let j = 1; j < box.length; j++) {
        let [ax, ay] = box[j - 1]
        let [bx, by] = box[j]
        offs.beginPath()
        offs.moveTo(ax, ay)
        offs.lineTo(bx, by)
        offs.stroke()

        if (h === j) {
          ons.beginPath()
          ons.moveTo(ax, ay)
          ons.lineTo(bx, by)
          ons.stroke()
        }
      }
    }
  })
}
