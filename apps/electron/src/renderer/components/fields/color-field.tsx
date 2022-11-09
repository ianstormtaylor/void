import { Swatch } from '../ui/swatch'

export let ColorField = (props: {
  value: string
  label: string
  onChange: (value: string) => void
}) => {
  let { value, label, onChange } = props
  return (
    <div className="relative -mx-2.5">
      <label
        title={label}
        className="absolute h-full top-0.5 -ml-px py-1.5 pl-2.5 inline-block text-gray-400 select-none cursor-ew-resize"
      >
        <Swatch fill={value} />
      </label>
      <input
        value={value}
        onChange={() => onChange(value)}
        className="w-full py-1.5 px-2.5 pl-8 rounded border border-transparent hover:border-gray-200"
      />
    </div>
  )
}
