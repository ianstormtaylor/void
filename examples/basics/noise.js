import { Void } from 'void'
import { createNoise2D } from 'simplex-noise'

export default function () {
  let noise = createNoise2D(Void.random)
  let { width, height } = Void.settings([400, 400, 'px'])
  let ctx = Void.layer()

  let size = Void.int('size', 2, 10, 2)
  let octaves = Void.int('octaves', 1, 6)
  let amplitude = Void.int('amplitude', 1, 20)
  let persistence = Void.float('persistence', 0.1, 1, 0.1)
  let frequency = Void.int('frequency', 1, 24)
  let lacunarity = Void.int('lacunarity', 2, 16, 2)

  for (let x = 0; x < width; x += size) {
    for (let y = 0; y < height; y += size) {
      let tx = x / width
      let ty = y / height
      let sum = 0
      let max = 0
      let a = amplitude
      let f = frequency

      for (let o = 0; o < octaves; o++) {
        let n = noise(tx * f, ty * f)
        sum += n * a
        max += a
        a *= persistence
        f *= lacunarity
      }

      sum /= 2 - 1 / 2 ** (octaves - 1)
      let v = sum / max
      let l = Math.round(((v + 1) / 2) * 100)
      ctx.fillStyle = `hsl(0, 0%, ${l}%)`
      ctx.fillRect(x, y, size, size)
    }
  }
}
