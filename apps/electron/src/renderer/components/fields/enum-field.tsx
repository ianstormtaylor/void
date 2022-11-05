import { useRef } from 'react'
import { OptionSchema } from 'void'

export let EnumField = (props: {
  value: any
  label: string
  valueClassName?: string
  options: OptionSchema[]
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
        <span className="font-light text-gray-500">{label}</span>
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
            <option key={option.name} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </label>
  )
}
