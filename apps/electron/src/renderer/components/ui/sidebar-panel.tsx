import React, { useState } from 'react'
import { MdChevronRight, MdExpandMore } from 'react-icons/md'

export let SidebarPanel = (props: {
  title: React.ReactNode
  children: React.ReactNode
  buttons?: React.ReactNode
  summary?: React.ReactNode
  className?: string
  initialExpanded?: boolean
}) => {
  let {
    title,
    children,
    buttons = null,
    summary = null,
    className = '',
    initialExpanded = true,
  } = props
  let [expanded, setExpanded] = useState(initialExpanded)
  return (
    <div
      className={`
        ${className}
        group px-4 py-2.5 space-y-0.5 border-b border-gray-200
      `}
    >
      <div className="flex items-center justify-between h-7">
        <div
          className="flex items-center space-x-0.5 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <h2 className="font-semibold">{title}</h2>
          <div
            className={`
              text-lg text-gray-300
              ${expanded ? 'hidden group-hover:inline' : ''}
            `}
          >
            {expanded ? <MdChevronRight /> : <MdExpandMore />}
          </div>
        </div>
        <div>
          {expanded ? (
            <div className="flex items-center -mr-2">{buttons}</div>
          ) : (
            <div className="flex items-center text-gray-400">{summary}</div>
          )}
        </div>
      </div>
      {expanded && children}
    </div>
  )
}
