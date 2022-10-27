import { MdSelectAll } from 'react-icons/md'
import { Config } from 'void'

export let MarginsField = (props: { config: Config }) => {
  let { config } = props
  let { margin } = config
  let values: number[] = []
  let [t, r, b, l, units] = margin

  if (t == r && t == b && t == l) {
    values.push(t)
  } else if (t == b && r == l) {
    values.push(t, r)
  } else {
    values.push(t, r, b, l)
  }

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
          {values.join(', ')} {units}
        </span>
      </div>
    </div>
  )
}
