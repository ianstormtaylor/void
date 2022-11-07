import React from 'react'

export let IconButton = (
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }
) => {
  let { active, disabled, className, ...rest } = props
  return (
    <button
      {...rest}
      disabled={disabled}
      className={`
        ${className ?? ''}
        flex w-7 h-7 items-center justify-center text-base rounded
        ${active ? 'text-black' : 'text-gray-300'}
        ${
          disabled ? 'cursor-not-allowed' : 'hover:text-black hover:bg-gray-100'
        }
      `}
    />
  )
}
