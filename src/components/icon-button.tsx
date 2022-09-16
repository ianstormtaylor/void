import React from 'react'

export let IconButton = (props: React.HTMLProps<HTMLButtonElement>) => {
  let { className = '', ...rest } = props
  return (
    <button
      {...rest}
      className={`
        ${className}
        flex w-7 h-7 items-center justify-center text-base rounded
        text-gray-400 hover:bg-gray-100 hover:text-black
      `}
    />
  )
}
