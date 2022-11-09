import { Void } from 'void'

export default function () {
  let { width, height } = Void.settings([300, 300, 'px'])
  let ctx = Void.layer()
  ctx.beginPath()
  ctx.arc(width / 2, height / 2, width / 3, 0, Math.PI * 2, false)
  ctx.fill()
}
