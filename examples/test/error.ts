import { Void } from 'void'

export default function () {
  let { width, height } = Void.settings([300, 300, 'px'])
  let context = Void.layer('main')
  context.beginPat()
  context.arc(width / 2, height / 2, width / 3, 0, Math.PI * 2, false)
  context.fill()
}
