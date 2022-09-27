export let BooleanField = (props: {
  value: boolean
  label: string
  valueClassName?: string
  onChange: (value: boolean) => void
}) => {
  let { value, label, onChange, valueClassName = '' } = props
  return (
    <label className="flex -mx-2 py-1.5 px-2 rounded cursor-pointer hover:outline hover:outline-1 hover:outline-gray-200">
      <div className="flex flex-0 flex-shrink-0 w-28 items-center space-x-1">
        <span className="font-light text-gray-500">{label}</span>
      </div>
      <div className={valueClassName}>{value ? 'true' : 'false'}</div>
      <input
        className="sr-only"
        type="checkbox"
        checked={value}
        onChange={(e) => {
          onChange(e.target.checked)
        }}
      />
    </label>
  )
}
