import { Void } from 'void'

export default function () {
  let layer = Void.layer()
  layer.moveTo(0.25, 0.25)
  layer.lineTo(0.75, 0.75)
  layer.stroke()
}
