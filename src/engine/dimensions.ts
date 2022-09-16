/** The unit of measurement for the canvas. */
export type Units = 'm' | 'cm' | 'mm' | 'in' | 'ft' | 'pt' | 'pc' | 'px'

export type System = 'metric' | 'imperial'

/** The dimensions of the canvas, with specific units. */
export type Dimensions = [number, number, Units]

/** The margins of the canvas, with specific units. */
export type Margins =
  | [number, Units]
  | [number, number, Units]
  | [number, number, number, Units]
  | [number, number, number, number, Units]

/** The orientation of the canvas. */
export type Orientation = 'portrait' | 'landscape' | 'square'

/** Known paper sizes. */
export type Paper =
  // ISO A
  | '4A0'
  | '2A0'
  | 'A0'
  | 'A1'
  | 'A2'
  | 'A3'
  | 'A4'
  | 'A5'
  | 'A6'
  | 'A7'
  | 'A8'
  | 'A9'
  | 'A10'
  // ISO B
  | 'B0'
  | 'B1'
  | 'B1+'
  | 'B2'
  | 'B2+'
  | 'B3'
  | 'B4'
  | 'B5'
  | 'B6'
  | 'B7'
  | 'B8'
  | 'B9'
  | 'B10'
  | 'B11'
  | 'B12'
  // ISO C
  | 'C0'
  | 'C1'
  | 'C2'
  | 'C3'
  | 'C4'
  | 'C5'
  | 'C6'
  | 'C7'
  | 'C8'
  | 'C9'
  | 'C10'
  | 'C11'
  | 'C12'
  // United States
  | 'Half Letter'
  | 'Junior Legal'
  | 'Letter'
  | 'Legal'
  | 'Ledger'
  | 'Tabloid'
  | 'Government Letter'
  | 'Government Legal'
  // ANSI
  | 'Ansi A'
  | 'Ansi B'
  | 'Ansi C'
  | 'Ansi D'
  | 'Ansi E'
  // ARCH
  | 'Arch A'
  | 'Arch B'
  | 'Arch C'
  | 'Arch D'
  | 'Arch E'
  | 'Arch E1'
  | 'Arch E2'
  | 'Arch E3'

/** Common canvas dimensions. */
export const DIMENSIONS: Record<Paper, Dimensions> = {
  // Source: https://papersizes.io
  // ISO A
  '4A0': [1682, 2378, 'mm'],
  '2A0': [1189, 1682, 'mm'],
  'A0': [841, 1189, 'mm'],
  'A1': [594, 841, 'mm'],
  'A2': [420, 594, 'mm'],
  'A3': [297, 420, 'mm'],
  'A4': [210, 297, 'mm'],
  'A5': [148, 210, 'mm'],
  'A6': [105, 148, 'mm'],
  'A7': [74, 105, 'mm'],
  'A8': [52, 74, 'mm'],
  'A9': [37, 52, 'mm'],
  'A10': [26, 37, 'mm'],
  // ISO B
  'B0': [1000, 1414, 'mm'],
  'B1': [707, 1000, 'mm'],
  'B1+': [720, 1020, 'mm'],
  'B2': [500, 707, 'mm'],
  'B2+': [520, 720, 'mm'],
  'B3': [353, 500, 'mm'],
  'B4': [250, 353, 'mm'],
  'B5': [176, 250, 'mm'],
  'B6': [125, 176, 'mm'],
  'B7': [88, 125, 'mm'],
  'B8': [62, 88, 'mm'],
  'B9': [44, 62, 'mm'],
  'B10': [31, 44, 'mm'],
  'B11': [22, 32, 'mm'],
  'B12': [16, 22, 'mm'],
  // ISO C
  'C0': [917, 1297, 'mm'],
  'C1': [648, 917, 'mm'],
  'C2': [458, 648, 'mm'],
  'C3': [324, 458, 'mm'],
  'C4': [229, 324, 'mm'],
  'C5': [162, 229, 'mm'],
  'C6': [114, 162, 'mm'],
  'C7': [81, 114, 'mm'],
  'C8': [57, 81, 'mm'],
  'C9': [40, 57, 'mm'],
  'C10': [28, 40, 'mm'],
  'C11': [22, 32, 'mm'],
  'C12': [16, 22, 'mm'],
  // United States
  'Half Letter': [5.5, 8.5, 'in'],
  'Junior Legal': [5, 8, 'in'],
  'Letter': [8.5, 11, 'in'],
  'Legal': [8.5, 14, 'in'],
  'Ledger': [11, 17, 'in'],
  'Tabloid': [11, 17, 'in'],
  'Government Letter': [8, 10.5, 'in'],
  'Government Legal': [8.5, 13, 'in'],
  // ANSI
  'Ansi A': [8.5, 11, 'in'],
  'Ansi B': [11, 17, 'in'],
  'Ansi C': [17, 22, 'in'],
  'Ansi D': [22, 34, 'in'],
  'Ansi E': [34, 44, 'in'],
  // ARCH
  'Arch A': [9, 12, 'in'],
  'Arch B': [12, 18, 'in'],
  'Arch C': [18, 24, 'in'],
  'Arch D': [24, 36, 'in'],
  'Arch E': [36, 48, 'in'],
  'Arch E1': [30, 42, 'in'],
  'Arch E2': [26, 38, 'in'],
  'Arch E3': [27, 39, 'in'],
}
