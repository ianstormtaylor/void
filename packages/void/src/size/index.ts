import { PaperSize } from './paper-sizes'
import { VideoSize } from './video-sizes'

/** A recognized size keyword. */
export type Size = PaperSize | VideoSize

/** Export the size-related methods. */
export * as Size from './methods'
