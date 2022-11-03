import { Size, Sizes } from '..'
import { PaperSize, PAPER_SIZES } from './paper-sizes'
import { VideoSize, VIDEO_SIZES } from './video-sizes'

/** Get the dimensions for a size. */
export function dimensions(size: Size): Sizes<2> {
  if (isPaper(size)) return PAPER_SIZES[size].slice() as Sizes<2>
  if (isVideo(size)) return VIDEO_SIZES[size].slice() as Sizes<2>
  throw new Error(`Unrecognized size keyword: "${size}"`)
}

/** Check if a `value` is a size keyword. */
export function is(value: unknown): value is Size {
  return isVideo(value) || isPaper(value)
}

/** Check if a `value` is a paper size. */
export function isPaper(value: unknown): value is PaperSize {
  return typeof value === 'string' && value in PAPER_SIZES
}

/** Check if a `value` is a video size. */
export function isVideo(value: unknown): value is VideoSize {
  return typeof value === 'string' && value in VIDEO_SIZES
}

/** Try to match a `width`, `height`, and `units` to a size keyword. */
export function match(
  width: number,
  height: number,
  units: string
): Size | null {
  for (let [size, [w, h, u]] of Object.entries(VIDEO_SIZES)) {
    if (u !== units) continue
    if ((w !== width || h !== height) && (w !== height || h !== width)) continue
    return size as VideoSize
  }

  for (let [size, [w, h, u]] of Object.entries(PAPER_SIZES)) {
    if (u !== units) continue
    if ((w !== width || h !== height) && (w !== height || h !== width)) continue
    return size as PaperSize
  }

  return null
}
