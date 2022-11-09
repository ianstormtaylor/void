import { Random, Void } from 'void'

export default function () {
  let fps = 10
  let r = Void.int('radius', 4, 12, 2)
  let v = Void.int('velocity', 20, 40, 5)
  let { width, height } = Void.settings({
    dimensions: [500, 500, 'px'],
    fps,
  })

  let bg = Void.layer('background')
  bg.fillRect(0, 0, width, height)

  let main = Void.layer('main')
  main.lineWidth = 1
  main.strokeStyle = 'rgb(75,50,50)'

  let colors = ['white', 'red', 'blue', 'green', 'yellow', 'magenta']
  let balls: [[number, number], [number, number], string][] = Array.from(
    { length: 10 },
    () => {
      let x = Random.float(r, width - r)
      let y = Random.float(r, height - r)
      let angle = Random.float(0, Math.PI * 2)
      let vx = Math.cos(angle) * v
      let vy = Math.sin(angle) * v
      let color = Random.pick(colors)
      return [[x, y], [vx, vy], color]
    }
  )

  Void.draw(() => {
    main.fillStyle = 'rgba(0,0,0,0.5)'
    main.fillRect(0, 0, width, height)
    for (let ball of balls) {
      let [pos, vel, color] = ball
      let [x, y] = pos
      let [vx, vy] = vel
      if (x > width - r || x < r) vx = -vx
      if (y > height - r || y < r) vy = -vy
      x += vx
      y += vy
      main.fillStyle = color
      main.beginPath()
      main.arc(x + r, y + r, r, 0, Math.PI * 2, false)
      main.fill()
      ball[0] = [x, y]
      ball[1] = [vx, vy]
    }
  })
}
