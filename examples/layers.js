import { Void } from 'void'

export default function () {
  // Setup a square canvas.
  let { width } = Void.settings([300, 300, 'px'])

  // Define some variables.
  let center = width / 2
  let diameter = width / 4
  let offset = width / 10

  // Create the bottom layer with a red circle on it.
  let one = Void.layer()
  one.fillStyle = 'red'
  one.beginPath()
  one.arc(center - offset, center - offset, diameter, 0, Math.PI * 2, false)
  one.fill()

  // Create the top layer with a blue circle on it.
  let two = Void.layer()
  two.fillStyle = 'blue'
  two.beginPath()
  two.arc(center + offset, center + offset, diameter, 0, Math.PI * 2, false)
  two.fill()
}
