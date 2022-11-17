/** Export the size-related methods namespace. */
export * as Size from './methods'

/** A recognized size keyword. */
export type Size = keyof typeof SIZES

/** Sizes of length `N`, with specific units. */
export type Sizes<N extends number, T extends number[] = []> = T extends {
  length: N
}
  ? [...T, Units]
  : Sizes<N, [...T, number]>

/** The unit of measurement for the canvas. */
export type Units = 'm' | 'cm' | 'mm' | 'in' | 'ft' | 'yd' | 'pt' | 'pc' | 'px'

/** Types of unit systems. */
export type UnitsSystem = 'metric' | 'imperial'

/** A dictionary of recognized paper sizes. */
export const SIZES = {
  // ISO A
  // https://en.wikipedia.org/wiki/ISO_216
  A0: [841, 1189, 'mm'],
  A1: [594, 841, 'mm'],
  A2: [420, 594, 'mm'],
  A3: [297, 420, 'mm'],
  A4: [210, 297, 'mm'],
  A5: [148, 210, 'mm'],
  A6: [105, 148, 'mm'],
  A7: [74, 105, 'mm'],
  A8: [52, 74, 'mm'],
  A9: [37, 52, 'mm'],
  A10: [26, 37, 'mm'],
  // ISO B
  // https://en.wikipedia.org/wiki/ISO_216
  B0: [1000, 1414, 'mm'],
  B1: [707, 1000, 'mm'],
  B2: [500, 707, 'mm'],
  B3: [353, 500, 'mm'],
  B4: [250, 353, 'mm'],
  B5: [176, 250, 'mm'],
  B6: [125, 176, 'mm'],
  B7: [88, 125, 'mm'],
  B8: [62, 88, 'mm'],
  B9: [44, 62, 'mm'],
  B10: [31, 44, 'mm'],
  // ISO C
  // https://en.wikipedia.org/wiki/ISO_216
  C0: [917, 1297, 'mm'],
  C1: [648, 917, 'mm'],
  C2: [458, 648, 'mm'],
  C3: [324, 458, 'mm'],
  C4: [229, 324, 'mm'],
  C5: [162, 229, 'mm'],
  C6: [114, 162, 'mm'],
  C7: [81, 114, 'mm'],
  C8: [57, 81, 'mm'],
  C9: [40, 57, 'mm'],
  C10: [28, 40, 'mm'],
  // US
  // https://en.wikipedia.org/wiki/Paper_size
  // https://papersizes.io
  // https://www.princexml.com/doc/page-size-keywords/
  Letter: [8.5, 11, 'in'],
  Legal: [8.5, 14, 'in'],
  Tabloid: [11, 17, 'in'],
  // JIS B
  // https://en.wikipedia.org/wiki/Paper_size
  'JIS B0': [1030, 1456, 'mm'],
  'JIS B1': [728, 1030, 'mm'],
  'JIS B2': [515, 728, 'mm'],
  'JIS B3': [364, 515, 'mm'],
  'JIS B4': [257, 364, 'mm'],
  'JIS B5': [182, 257, 'mm'],
  'JIS B6': [128, 182, 'mm'],
  'JIS B7': [91, 128, 'mm'],
  'JIS B8': [64, 91, 'mm'],
  'JIS B9': [45, 64, 'mm'],
  'JIS B10': [32, 45, 'mm'],
  // ANSI
  // https://en.wikipedia.org/wiki/Paper_size
  'ANSI A': [8.5, 11, 'in'],
  'ANSI B': [11, 17, 'in'],
  'ANSI C': [17, 22, 'in'],
  'ANSI D': [22, 34, 'in'],
  'ANSI E': [34, 44, 'in'],
  // ARCH
  // https://en.wikipedia.org/wiki/Paper_size
  'Arch A': [9, 12, 'in'],
  'Arch B': [12, 18, 'in'],
  'Arch C': [18, 24, 'in'],
  'Arch D': [24, 36, 'in'],
  'Arch E': [36, 48, 'in'],
  // Photographic
  // https://en.wikipedia.org/wiki/Photo_print_sizes
  '4R': [4, 6, 'in'],
  '5R': [5, 7, 'in'],
  '6R': [6, 8, 'in'],
  '8R': [8, 10, 'in'],
  '10R': [10, 12, 'in'],
  '11R': [11, 14, 'in'],
  '12R': [12, 15, 'in'],
  '14R': [14, 17, 'in'],
  '16R': [16, 20, 'in'],
  '20R': [20, 24, 'in'],
  // 16:9 (UHD)
  // https://en.wikipedia.org/wiki/Display_resolution
  // https://support.google.com/youtube/answer/6375112
  '240p': [426, 240, 'px'],
  '360p': [640, 360, 'px'],
  '480p': [854, 480, 'px'],
  '720p': [1280, 720, 'px'],
  '1080p': [1920, 1080, 'px'],
  '1440p': [2560, 1440, 'px'],
  '2160p': [3840, 2160, 'px'],
  '4320p': [7680, 4320, 'px'],
} as const
