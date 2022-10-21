import 'svg2pdf.js'
import { Context } from 'svgcanvas'
import { jsPDF } from 'jspdf'
import { Scene, Module, Traits, run } from 'void'

/** Export a PNG file from the current `canvas` element. */
export let exportPng = (canvas: HTMLCanvasElement) => {
  let url = canvas.toDataURL('image/png')
  downloadFile(url, 'png')
}

/** Export an SVG file from a `scene` and `module`. */
export let exportSvg = (module: Module, scene: Scene, traits: Traits) => {
  let svg = getSvg(module, scene, traits)
  let blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  let url = URL.createObjectURL(blob)
  downloadFile(url, 'svg')
}

/** Export a vector PDF file from a `scene` and `module`. */
export let exportPdf = async (module: Module, scene: Scene, traits: Traits) => {
  let string = getSvg(module, scene, traits)
  let div = document.createElement('div')
  div.innerHTML = string
  let el = div.firstChild as SVGSVGElement
  let [width, height] = Scene.outerDimensions(scene)
  let { units } = scene
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
let getSvg = (module: Module, scene: Scene, traits: Traits): string => {
  let { width, height, units } = scene
  let canvas = document.createElement('canvas')
  let context = new Context(`${width}${units}`, `${height}${units}`)
  run(module, {
    scene: { ...scene },
    traits: { ...traits },
    canvas,
    context,
  })
  let svg = context.getSerializedSvg()
  return svg
}
