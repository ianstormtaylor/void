import React, { useCallback, useRef, useState } from 'react'
import { MdTag } from 'react-icons/md'
import { useLatest } from 'react-use'

// A tiny empty image for replacing the default drag image.
let DRAG_IMAGE = new Image(0, 0)
DRAG_IMAGE.src =
  'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

export let NumberField = (props: {
  value: number
  step: number
  multiplier?: number
  label: string
  icon?: React.ReactNode
  min?: number
  max?: number
  valueClassName?: string
  onChange: (value: number) => void
}) => {
  let {
    value,
    icon,
    step,
    label,
    multiplier = 10,
    min = -Infinity,
    max = Infinity,
    valueClassName = '',
    onChange,
  } = props
  let [prevValue, setPrevValue] = useState(value)
  let [text, setText] = useState(`${value}`)
  let [focused, setFocused] = useState(false)
  let latestValue = useLatest(value)
  let clickRef = useRef(false)
  let inputRef = useRef<HTMLInputElement>(null)
  let dragPositionRef = useRef(0)
  let dragHandlerRef = useRef<(e: DragEvent) => void | null>()

  // If the value changes, sync our internal text state.
  if (value !== prevValue) {
    setText(`${value}`)
    setPrevValue(value)
  }

  // Set a new value from a number or string, avoiding dupes, keeping state.
  let setValue = useCallback(
    (v: number | string) => {
      let val = Number(v)
      if (isNaN(val)) return
      val = Math.min(max, Math.max(min, val))
      if (val === latestValue.current) return
      onChange(val)
      let rounded = Math.round(val / step) * step
      let text = Math.abs(val - rounded) < 0.00001 ? `${rounded}` : `${val}`
      setText(text)
    },
    [onChange, setText]
  )

  return (
    <label
      className={`
        flex-1 flex -mx-2 py-1.5 px-2 rounded
        ${
          focused
            ? 'outline outline-black outline-2'
            : 'hover:outline hover:outline-1 hover:outline-gray-200'
        }
      `}
    >
      <div
        className={`
          flex flex-0 flex-shrink-0 items-center space-x-1 cursor-ew-resize
          ${icon ? 'w-5' : 'w-28'}
        `}
        draggable
        title={icon ? label : undefined}
        onClick={(e) => {
          inputRef.current.select()
        }}
        onDragStart={(e) => {
          dragHandlerRef.current = (e: DragEvent) => {
            let diffX = e.clientX - dragPositionRef.current
            let steps = Math.ceil(diffX / 5)
            let m = e.shiftKey ? multiplier : 1
            setValue(value + steps * step * m)
          }
          document.body.addEventListener('dragover', dragHandlerRef.current)
          dragPositionRef.current = e.clientX
          e.dataTransfer.setDragImage(DRAG_IMAGE, 0, 0)
        }}
        onDragEnd={(e) => {
          document.body.removeEventListener('dragover', dragHandlerRef.current)
        }}
      >
        <span className="text-base text-gray-400 -ml-0.5">
          {icon ?? <MdTag />}
        </span>
        {icon == null && (
          <span className="font-light text-gray-500">{label}</span>
        )}
      </div>
      <div className="relative flex-1">
        <input
          ref={inputRef}
          className={`
            ${valueClassName}
            block w-full focus:outline-none
          `}
          value={text}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setValue(text)
            setFocused(false)
          }}
          onChange={(e) => {
            let v = e.target.value
            v = v.replaceAll(/[^-,.\d]/g, '')
            setText(v)
          }}
          onMouseDown={(e) => {
            let el = e.target as HTMLInputElement
            clickRef.current = document.activeElement !== el
          }}
          onClick={(e) => {
            let el = e.target as HTMLInputElement
            if (clickRef.current) el.select()
          }}
          onKeyDown={(e) => {
            let s = e.shiftKey ? step * multiplier : step
            let c = e.code
            if (c === 'ArrowUp') {
              e.preventDefault()
              setValue(value + s)
            } else if (c === 'ArrowDown') {
              e.preventDefault()
              setValue(value - s)
            } else if (c === 'Enter') {
              e.preventDefault()
              setValue(text)
            }
          }}
        />
      </div>
    </label>
  )
}
