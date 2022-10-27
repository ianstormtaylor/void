import { MdOutlineFeed, MdOutlineImage, MdPhotoFilter } from 'react-icons/md'
import { exportPdf, exportPng, exportSvg } from '../../export'
import { useModule } from '../../contexts/module'
import { useCanvasRef } from '../../contexts/canvas'
import { Settings, Traits } from 'void'

export let ExportPanel = (props: { settings: Settings; traits: Traits }) => {
  let { settings, traits } = props
  let module = useModule()
  let canvasRef = useCanvasRef()
  return (
    <div className="p-4 pb-3 space-y-0.5">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold mb-3">Export</h2>
      </div>
      <div className="flex space-x-2">
        <button
          className={`
            flex-1 flex w-7 h-7 items-center justify-center space-x-1 rounded
            text-gray-400 border border-gray-200 hover:border-black hover:text-black
          `}
          onClick={() => {
            let canvas = canvasRef.current
            if (canvas) exportPng(canvas)
          }}
        >
          <MdOutlineImage className="text-base" /> <span>PNG</span>
        </button>
        <button
          className={`
            flex-1 flex w-7 h-7 items-center justify-center space-x-1 rounded
            text-gray-400 border border-gray-200 hover:border-black hover:text-black
          `}
          onClick={() => {
            exportSvg(module, settings, traits)
          }}
        >
          <MdPhotoFilter className="text-base" /> <span>SVG</span>
        </button>
        <button
          className={`
            flex-1 flex w-7 h-7 items-center justify-center space-x-1 rounded
            text-gray-400 border border-gray-200 hover:border-black hover:text-black
          `}
          onClick={() => {
            exportPdf(module, settings, traits)
          }}
        >
          <MdOutlineFeed className="text-base" /> <span>PDF</span>
        </button>
      </div>
    </div>
  )
}
