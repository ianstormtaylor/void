import { MdSelectAll } from 'react-icons/md'
import { State } from '../../electron/shared/engine/sketch'

export let MarginsField = (props: { state: State }) => {
  let { state } = props
  let { margin } = state
  let unit = margin.at(-1)
  let widths = margin.slice(0, -1)
  return (
    <div className="flex items-center -mx-2 p-2 space-x-2">
      <div
        title="Margins"
        className="-ml-0.5 text-base text-gray-400 select-none"
      >
        <MdSelectAll />
      </div>
      <div className="flex items-center space-x-2">
        <span>
          {widths.join(' × ')} {unit}
        </span>
      </div>
    </div>
  )
}
