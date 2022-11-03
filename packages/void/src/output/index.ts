/** Output settings when exporting a sketch. */
export type Output = {
  type: OutputType
  quality: number
}

/** The list of possible output types. */
export const OUTPUT_TYPES = ['png', 'jpg', 'webp', 'svg', 'pdf'] as const

/** An output type. */
export type OutputType = typeof OUTPUT_TYPES[number]

/** A dictionary of output mime types. */
export const OUTPUT_MIME_TYPES: Record<OutputType, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  pdf: 'application/pdf',
}
