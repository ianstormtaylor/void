import { MdCrop } from 'react-icons/md'
import { Config, Sketch, Size } from 'void'

export let DimensionsField = (props: { sketch: Sketch }) => {
  let { sketch } = props
  let { config } = sketch
  let orientation = Config.orientation(config)
  let dimensions = Config.dimensions(config)
  let [width, height, units] = dimensions
  let infinite = false

  if (width === Infinity || height === Infinity) {
    ;[width, height] = Sketch.dimensions(sketch)
    units = sketch.settings.units
    infinite = true
  }

  let size = Size.match(width, height, units)
  let max = Math.max(width, height)
  let min = Math.min(width, height)

  if (orientation === 'portrait') {
    ;[width, height] = [min, max]
  } else if (orientation === 'landscape') {
    ;[width, height] = [max, min]
  } else if (orientation === 'square') {
    ;[width, height] = [min, min]
  }

  return (
    <div className="flex items-center -mx-2 p-2 space-x-2">
      <div
        title="Dimensions"
        className="-ml-0.5 text-base text-gray-400 select-none"
      >
        <MdCrop />
      </div>
      <div className="flex items-center space-x-1.5">
        <span>
          {width} &times; {height} {units}
        </span>
        {infinite && <span className="text-gray-400">(Fullscreen)</span>}
        {size && <span className="text-gray-400">({size})</span>}
      </div>
    </div>
  )
}
