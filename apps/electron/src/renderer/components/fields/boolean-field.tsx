export let BooleanField = (props: {
  value: boolean
  label: string
  valueClassName?: string
  onChange: (value: boolean) => void
}) => {
  let { value, label, onChange, valueClassName = '' } = props
  return (
    <label
      className={`
        group flex items-center -mx-2 p-1.5 pl-2 rounded cursor-pointer 
        hover:outline hover:outline-1 hover:outline-gray-200
      `}
    >
      <div className="flex flex-0 flex-shrink-0 w-24 items-center space-x-1">
        <span className="text-gray-400">{label}</span>
      </div>
      <div
        className={`
          relative flex-1
          ${valueClassName}
        `}
      >
        {value ? 'true' : 'false'}
      </div>
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
