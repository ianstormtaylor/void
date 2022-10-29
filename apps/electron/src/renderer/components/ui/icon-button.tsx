import React from 'react'

export let IconButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }
) => {
  let { active = false, className = '', ...rest } = props
  return (
    <button
      {...rest}
      className={`
        ${className}
        flex w-7 h-7 items-center justify-center text-base rounded
        hover:text-black hover:bg-gray-100
        ${active ? 'text-black' : 'text-gray-300'}
      `}
    />
  )
}
