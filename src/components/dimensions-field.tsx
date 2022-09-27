import React from 'react'
import { MdCrop } from 'react-icons/md'
import { State } from '../../electron/shared/engine/sketch'

export let DimensionsField = (props: { state: State }) => {
  let { state } = props
  let { paper, dimensions, orientation } = state
  let [width, height, units] = dimensions
  let max = Math.max(width, height)
  let min = Math.min(width, height)

  if (orientation === 'portrait') {
    ;[width, height] = [min, max]
  } else if (orientation === 'landscape') {
    ;[width, height] = [max, min]
  } else if (orientation === 'square') {
    ;[width, height] = [min, min]
  }

  let dims = (
    <span>
      {width} &times; {height} {units}
    </span>
  )
  return (
    <div className="flex items-center -mx-2 p-2 space-x-2">
      <div
        title="Dimensions"
        className="-ml-0.5 text-base text-gray-400 select-none"
      >
        <MdCrop />
      </div>
      <div className="flex items-center space-x-1.5">
        {dims}
        {paper && <span className="text-gray-500 font-light">({paper})</span>}
      </div>
    </div>
  )
}
