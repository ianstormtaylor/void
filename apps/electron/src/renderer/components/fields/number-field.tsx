import React, { useCallback, useRef, useState } from 'react'
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
  let [text, setText] = useState(toText(value, step))
  let [focused, setFocused] = useState(false)
  let latestValue = useLatest(value)
  let clickRef = useRef(false)
  let inputRef = useRef<HTMLInputElement>(null)
  let dragPositionRef = useRef(0)
  let dragHandlerRef = useRef<(e: DragEvent) => void | null>()

  // If the value changes, sync our internal text state.
  if (value !== prevValue) {
    let text = toText(value, step)
    setText(text)
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
      let text = toText(val, step)
      setText(text)
    },
    [onChange, setText]
  )

  return (
    <label
      className={`
        group flex items-center -mx-2 p-1.5 pl-2 rounded
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
          ${icon ? 'w-5' : 'w-24'}
        `}
        draggable
        title={icon ? label : undefined}
        onClick={() => {
          if (inputRef.current) inputRef.current.select()
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
          document.body.removeEventListener('dragover', dragHandlerRef.current!)
        }}
      >
        {icon ? (
          <span className="text-base text-gray-400 -ml-0.5">{icon}</span>
        ) : (
          <span className="text-gray-400">{label}</span>
        )}
      </div>
      <div className="relative flex-1">
        <input
          ref={inputRef}
          className={`
            block w-full focus:outline-none
            ${valueClassName}
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

/** Print a `number` as a string with precision equal to its `step`. */
function toText(number: number, step: number): string {
  if (number === 0) return `0`
  let rounded = Math.round(number / step) * step
  let isRound = isRoughlyEqual(number, rounded)
  let precision = isRound ? getPrecision(step) : getPrecision(number)
  let string = number.toFixed(precision)
  return string
}

/** Get the precision of a `number`. */
function getPrecision(number: number): number {
  let [, decimals] = String(number).split('.')
  return decimals?.length ?? 0
}

/** Check if a numbers `a` and `b` are equal within a small precision. */
function isRoughlyEqual(a: number, b: number) {
  return Math.abs(a - b) <= 0.000001
}
