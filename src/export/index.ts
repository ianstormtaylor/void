import 'svg2pdf.js'
import { Context } from 'svgcanvas'
import { jsPDF } from 'jspdf'
import { convert, Scene, Module } from '../../void'

/** Export a PNG file from the current `canvas` element. */
export let exportPng = (canvas: HTMLCanvasElement) => {
  let url = canvas.toDataURL('image/png')
  downloadFile(url, 'png')
}

/** Export an SVG file from a `scene` and `module`. */
export let exportSvg = (scene: Scene, module: Module) => {
  let svg = getSvg(scene, module)
  let blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  let url = URL.createObjectURL(blob)
  downloadFile(url, 'svg')
}

/** Export a vector PDF file from a `scene` and `module`. */
export let exportPdf = async (scene: Scene, module: Module) => {
  let string = getSvg(scene, module)
  let div = document.createElement('div')
  div.innerHTML = string
  let el = div.firstChild as SVGSVGElement
  let [width, height] = getOuterDimensions(scene)
  let { units } = scene
  let doc = new jsPDF({
    unit: units as any,
    format: [width, height],
    hotfixes: ['px_scaling'],
  })
  await doc.svg(el, { width, height, x: 0, y: 0 })
  doc.save('download.pdf')
}

/** Get the sketch's inner dimensions. */
export let getInnerDimensions = (scene: Scene): [number, number] => {
  let { width, height } = scene
  return [width, height]
}

/** Get the sketch's outer dimensions. */
export let getOuterDimensions = (scene: Scene): [number, number] => {
  let { width, height, margin } = scene
  return [width + margin[1] + margin[3], height + margin[0] + margin[2]]
}

/** Get a sketch's output dimensions. */
export let getOutputDimensions = (scene: Scene): [number, number] => {
  let [outerWidth, outerHeight] = getOuterDimensions(scene)
  let { units } = scene
  let w = convert(outerWidth, units, { to: 'px', precision: 1, dpi: 72 })
  let h = convert(outerHeight, units, { to: 'px', precision: 1, dpi: 72 })
  return [w, h]
}

/** Get a sketch's screen dimensions. */
export let getScreenDimensions = (scene: Scene): [number, number] => {
  let [outputWidth, outputHeight] = getOutputDimensions(scene)
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
let getSvg = (scene: Scene, module: Module): string => {
  let { sketch } = module
  let { width, height, margin, units } = scene
  let context = new Context(`${width}${units}`, `${height}${units}`)
  context.translate(margin[3], margin[0])
  sketch({ ...scene, context })
  let svg = context.getSerializedSvg()
  return svg
}
