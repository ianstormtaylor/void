import { Size, Sizes, SIZES } from '..'

/** Get the dimensions for a size. */
export function dimensions(size: Size): Sizes<2> {
  if (is(size)) return SIZES[size].slice() as Sizes<2>
  throw new Error(`Unrecognized size keyword: "${size}"`)
}

/** Check if a `value` is a size keyword. */
export function is(value: unknown): value is Size {
  return typeof value === 'string' && value in SIZES
}

/** Try to match a `width`, `height`, and `units` to a size keyword. */
export function match(
  width: number,
  height: number,
  units: string
): Size | null {
  for (let [size, [w, h, u]] of Object.entries(SIZES)) {
    if (u !== units) continue
    if ((w !== width || h !== height) && (w !== height || h !== width)) continue
    return size as Size
  }

  return null
}
