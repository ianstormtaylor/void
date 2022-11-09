import React from 'react'

export let InfoField = (props: {
  label: string
  icon?: (props: React.HTMLAttributes<SVGElement>) => React.ReactElement
  children: React.ReactNode
}) => {
  let { icon: Icon, children, label } = props
  return (
    <div className="flex items-center -mx-2.5 py-1.5 pl-2.5">
      <label
        title={Icon ? label : undefined}
        className={`
          flex-none mr-2 text-gray-400 select-none
          ${Icon ? '-mx-0.5' : ''}
        `}
      >
        {Icon ? <Icon className="w-4 h-4 text-gray-400" /> : label}
      </label>
      {children}
    </div>
  )
}
