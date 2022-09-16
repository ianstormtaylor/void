import { Context } from 'svgcanvas'
import { Module, State } from './sketch'
import { jsPDF } from 'jspdf'
import 'svg2pdf.js'

/** Export a PNG file from the current `canvas` element. */
export let exportPng = (canvas: HTMLCanvasElement) => {
  let url = canvas.toDataURL('image/png')
  downloadFile(url, 'png')
}

/** Export an SVG file from a `state` and `module`. */
export let exportSvg = (state: State, module: Module) => {
  let svg = getSvg(state, module)
  let blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  let url = URL.createObjectURL(blob)
  downloadFile(url, 'svg')
}

/** Export a vector PDF file from a `state` and `module`. */
export let exportPdf = async (state: State, module: Module) => {
  let string = getSvg(state, module)
  let div = document.createElement('div')
  div.innerHTML = string
  let el = div.firstChild as SVGSVGElement
  let [width, height] = getOuterDimensions(state)
  let { units } = state
  let doc = new jsPDF({
    unit: units as any,
    format: [width, height],
    hotfixes: ['px_scaling'],
  })
  await doc.svg(el, { width, height, x: 0, y: 0 })
  doc.save('download.pdf')
}

/** Get the sketch's inner dimensions. */
export let getInnerDimensions = (state: State): [number, number] => {
  let { width, height, margins } = state
  return [width + margins[1] + margins[3], height + margins[0] + margins[2]]
}

/** Get the sketch's output sizes. */
export let getOuterDimensions = (state: State): [number, number] => {
  let { width, height, margins } = state
  return [width + margins[1] + margins[3], height + margins[0] + margins[2]]
}

/** Get a sketch's output dimensions. */
export let getOutputDimensions = (state: State): [number, number] => {
  let [outerWidth, outerHeight] = getOuterDimensions(state)
  let { units } = state
  let w = state.convert(outerWidth, units, { to: 'px', precision: 0 })
  let h = state.convert(outerHeight, units, { to: 'px', precision: 0 })
  return [w, h]
}

/** Get a sketch's screen dimensions. */
export let getScreenDimensions = (state: State): [number, number] => {
  let [outputWidth, outputHeight] = getOutputDimensions(state)
  let dpr = window.devicePixelRatio
  let w = outputWidth * dpr
  let h = outputHeight * dpr
  return [w, h]
}

/** Download a file with a `dataUrl` and `ext`. */
let downloadFile = (dataUrl: string, ext: string) => {
  let link = document.createElement('a')
  link.href = dataUrl
  link.download = `download.${ext}`
  link.click()
}

/** Get a serialized SVG string from drawing a sketch. */
let getSvg = (state: State, module: Module): string => {
  let { sketch } = module
  let { width, height, margins, units } = state
  let context = new Context(`${width}${units}`, `${height}${units}`)
  context.translate(margins[3], margins[0])
  sketch({ ...state, context })
  let svg = context.getSerializedSvg()
  return svg
}
