import { Sketch } from '.'

/** Execute the sketch's construct logic. */
export function construct(sketch: Sketch) {
  sketch.state = {
    playing: false,
    traits: {},
    schema: {},
    layers: {},
    frame: {
      count: -1,
      time: window.performance.now(),
      rate: 0,
    },
  }

  Sketch.exec(sketch, sketch.construct)
}

/** Get the current sketch from the global `VOID` context. */
export function current(): Sketch | undefined {
  return globalThis.VOID?.sketch
}

/** Execute the sketch's draw logic in a loop. */
export function draw(sketch: Sketch) {
  if (!sketch.draw || !sketch.state) return
  let { draw, state } = sketch
  let { frame } = state
  let fps = state.settings?.fps ?? 60
  let now = window.performance.now()
  let delta = now - frame.time
  let target = 1000 / fps
  let epsilon = 5

  if (delta >= target - epsilon) {
    Sketch.exec(sketch, () => {
      draw(
        (state.frame = {
          time: now,
          rate: 1000 / delta,
          count: frame.count + 1,
        })
      )
    })
  }

  state.raf = window.requestAnimationFrame(() => Sketch.draw(sketch))
}

/** Execute a `fn` with the sketch loaded on the global `VOID` context. */
export function exec(sketch: Sketch, fn: () => void) {
  let VOID = (globalThis.VOID ??= {})
  let prev = VOID.sketch
  VOID.sketch = sketch
  fn()
  VOID.sketch = prev
}

/** Create a sketch from a `construct` function, with optional `el` and `overrides`. */
export function of(
  construct: () => void,
  el: HTMLElement = document.body,
  overrides: Sketch['overrides'] = {}
): Sketch {
  let sketch: Sketch = { construct, el, overrides }
  Sketch.reset(sketch)
  return sketch
}

/** Play the sketch's draw loop. */
export function play(sketch: Sketch) {
  if (sketch.state?.playing) return
  if (!sketch.state) Sketch.construct(sketch)
  sketch.state!.playing = true
  Sketch.draw(sketch)
}

/** Pause the sketch's draw loop. */
export function pause(sketch: Sketch) {
  if (!sketch.state) return
  if (sketch.state.raf) window.cancelAnimationFrame(sketch.state.raf)
  sketch.state.playing = false
}

/** Stop and reset the sketch's draw loop. */
export function stop(sketch: Sketch) {
  if (!sketch.state) return
  Sketch.reset(sketch)
}

/** Reset a sketch to its initial state. */
export function reset(sketch: Sketch) {
  let { el, state } = sketch
  if (state?.raf) window.cancelAnimationFrame(state.raf)
  delete sketch.state
  while (el.firstChild) {
    el.removeChild(el.firstChild)
  }
}
