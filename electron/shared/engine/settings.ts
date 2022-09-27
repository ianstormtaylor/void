import { Dimensions, Paper, Orientation, Units, Margins } from './dimensions'

/** The filled-in settings for a sketch. */
export interface FullSettings<
  T extends Record<string, any> = Record<string, any>
> {
  dimensions: Dimensions
  dpi: number
  orientation: Orientation
  units: Units
  margin: Margins
  precision: number
  seed: number
  traits: T
  schema: Record<keyof T, Control>
}

/** The optional settings for configuring a sketch. */
export interface Settings<T extends Record<string, any> = Record<string, any>> {
  dimensions?: Dimensions | Paper
  dpi?: number
  orientation?: Orientation
  units?: Units
  margin?: Margins
  precision?: number
  seed?: number
  traits?: T
  schema?: Record<keyof T, Partial<Control>>
}

/** A configuration for the UI controls for a variable. */
export type Control = NumberControl | EnumControl | BooleanControl

export type NumberControl = {
  type: 'number'
  step: number
  min: number
  max: number
}

export type EnumControl = {
  type: 'enum'
  options: string[]
}

export type BooleanControl = {
  type: 'boolean'
}
