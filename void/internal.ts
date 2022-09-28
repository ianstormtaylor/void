import { Scene } from './'

/** The Void global for attaching the current scene as it's running. */
export type Void = {
  scene: Scene
}

export const __VOID__: Void = {
  scene: {
    dpi: 72,
    height: 150,
    margin: [0, 0, 0, 0],
    orientation: 'landscape',
    precision: 0,
    schema: {},
    seed: 1,
    traits: {},
    units: 'px',
    width: 300,
  },
}
