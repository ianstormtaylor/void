import React from 'react'

export let Swatch = (props: { fill?: string; stroke?: string }) => {
  let { fill = 'transparent', stroke } = props
  return (
    <div
      style={{ background: fill }}
      className="inline-block w-3.5 h-3.5 border border-gray-300 rounded-sm"
    />
  )
}
