import 'svg2pdf.js'
import { Context } from 'svgcanvas'
import { jsPDF } from 'jspdf'
import { Settings, Module, Traits, Sketch } from 'void'

/** Export a PNG file from the current `canvas` element. */
export let exportPng = (canvas: HTMLCanvasElement) => {
  let url = canvas.toDataURL('image/png')
  downloadFile(url, 'png')
}

/** Export an SVG file from a `settings` and `module`. */
export let exportSvg = (module: Module, settings: Settings, traits: Traits) => {
  let svg = getSvg(module, settings, traits)
  let blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  let url = URL.createObjectURL(blob)
  downloadFile(url, 'svg')
}

/** Export a vector PDF file from a `settings` and `module`. */
export let exportPdf = async (
  module: Module,
  settings: Settings,
  traits: Traits
) => {
  let string = getSvg(module, settings, traits)
  let div = document.createElement('div')
  div.innerHTML = string
  let el = div.firstChild as SVGSVGElement
  let [width, height] = Settings.outerDimensions(settings)
  let { units } = settings
  let doc = new jsPDF({
    unit: units as any,
    format: [width, height],
    hotfixes: ['px_scaling'],
  })
  await doc.svg(el, { width, height, x: 0, y: 0 })
  doc.save('download.pdf')
}

/** Download a file with a `dataUrl` and `ext`. */
let downloadFile = (dataUrl: string, ext: string) => {
  let link = document.createElement('a')
  link.href = dataUrl
  link.download = `download.${ext}`
  link.click()
}

/** Get a serialized SVG string from drawing a sketch. */
let getSvg = (sketch: Sketch): string => {
  let state = sketch.state
  let settings = state?.settings
  let layers = state?.layers
  if (!state || !settings || !layers) {
    throw new Error(`Cannot export a sketch that hasn't finished setting up!`)
  }

  let { width, height, units } = settings

  let context = new Context(`${width}${units}`, `${height}${units}`)

  run(module, {
    settings: { ...settings },
    traits: { ...traits },
    canvas,
    context,
  })
  let svg = context.getSerializedSvg()
  return svg
}
