/** Expose potentially non-exported top-level properties of sketches. */
export default {
  settings: typeof settings === 'undefined' ? null : settings,
  sketch: typeof sketch === 'undefined' ? null : sketch,
  draw: typeof draw === 'undefined' ? null : draw,
  setup: typeof setup === 'undefined' ? null : setup,
}
