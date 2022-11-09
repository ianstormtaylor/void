/** The preset known zoom levels. */
export let ZOOM_LEVELS = [
  0.0155125, 0.03125, 0.0625, 0.125, 0.25, 0.5, 1, 2, 4, 8, 16,
] as const

/** A known zoom level. */
export type Zoom = typeof ZOOM_LEVELS[number]

/** Zoom out to the next zoom level. */
export function zoomOut(zoom: number): Zoom {
  let next = ZOOM_LEVELS.slice()
    .reverse()
    .find((z) => z < zoom)
  return next ?? ZOOM_LEVELS[0]
}

/** Zoom in to the next zoom level. */
export function zoomIn(zoom: number): Zoom {
  let next = ZOOM_LEVELS.slice().find((z) => z > zoom)
  return next ?? ZOOM_LEVELS.at(-1)!
}
