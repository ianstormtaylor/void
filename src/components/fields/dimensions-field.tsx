import { MdCrop } from 'react-icons/md'
import { Paper } from '../../../void'
import { useSettings } from '../../contexts/settings'

export let DimensionsField = () => {
  let settings = useSettings()
  let { dimensions, orientation } = settings
  let [width, height, units] = dimensions
  let paper = Paper.match(width, height, units)
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
        {paper && <span className="text-gray-500 font-light">({paper})</span>}
      </div>
    </div>
  )
}
