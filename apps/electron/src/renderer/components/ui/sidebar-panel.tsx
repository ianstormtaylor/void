import React from 'react'

export let SidebarPanel = (props: {
  title: React.ReactNode
  children: React.ReactNode
  buttons?: React.ReactNode
  className?: string
}) => {
  let { title, children, buttons = null, className = '' } = props
  return (
    <div
      className={`
        ${className}
        p-4 pb-3 space-y-0.5
      `}
    >
      <div className="flex justify-between pb-1">
        <h2 className="font-semibold">{title}</h2>
        <div className="flex items-center -my-1.5 -mr-2">{buttons}</div>
      </div>
      {children}
    </div>
  )
}
