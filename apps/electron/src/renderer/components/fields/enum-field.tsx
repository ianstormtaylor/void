import { useRef } from 'react'

export let EnumField = (props: {
  label: string
  value: string
  options: string[]
  valueClassName?: string
  onChange: (value: any) => void
}) => {
  let { value, options, label, onChange, valueClassName = '' } = props
  let selectRef = useRef<HTMLSelectElement>(null)
  return (
    <label
      className={`
        group flex items-center -mx-2 p-1.5 pl-2 rounded cursor-pointer 
        hover:outline hover:outline-1 hover:outline-gray-200
      `}
      onClick={(e) => {
        if (selectRef.current) selectRef.current.click()
      }}
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
        <select
          ref={selectRef}
          className="appearance-none m-0 p-0 border-none outline-none w-full cursor-pointer"
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
          }}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </label>
  )
}
