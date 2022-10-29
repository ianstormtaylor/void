import React from 'react'

export let SidebarButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  let { className = '', ...rest } = props
  return (
    <button
      {...rest}
      className={`
        ${className}
        flex h-7 items-center justify-center space-x-0.5 rounded
        text-gray-400 border border-gray-200
        hover:text-black hover:border-black
      `}
    />
  )
}
