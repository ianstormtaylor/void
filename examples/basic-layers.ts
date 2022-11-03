import { Void } from 'void'

export default function () {
  let { width } = Void.settings([300, 300, 'px'])
  let center = width / 2
  let diameter = width / 4
  let offset = width / 10

  let one = Void.layer('one')
  one.fillStyle = 'red'
  one.beginPath()
  one.arc(center - offset, center - offset, diameter, 0, Math.PI * 2, false)
  one.fill()

  let two = Void.layer('two')
  two.fillStyle = 'blue'
  two.beginPath()
  two.arc(center + offset, center + offset, diameter, 0, Math.PI * 2, false)
  two.fill()
}
