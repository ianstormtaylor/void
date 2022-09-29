import { MdClear } from 'react-icons/md'

export let BooleanField = (props: {
  value: boolean
  label: string
  valueClassName?: string
  onChange: (value: boolean) => void
  onReset?: () => void
}) => {
  let { value, label, onChange, onReset, valueClassName = '' } = props
  return (
    <label
      className={`
        group flex items-center -mx-2 p-1.5 pl-2 rounded cursor-pointer 
        hover:outline hover:outline-1 hover:outline-gray-200
      `}
    >
      <div className="flex flex-0 flex-shrink-0 w-28 items-center space-x-1">
        <span className="font-light text-gray-500">{label}</span>
      </div>
      <div
        className={`
          relative flex-1
          ${valueClassName}
        `}
      >
        {value ? 'true' : 'false'}
      </div>
      {onReset && (
        <button
          title="Reset"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (onReset) onReset()
          }}
          className={`
            hidden group-hover:flex text-base
            text-gray-300 hover:text-gray-600
          `}
        >
          <MdClear />
        </button>
      )}
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
