import { MdOutlineFeed, MdOutlineImage, MdPhotoFilter } from 'react-icons/md'
import { FileType, Sketch } from 'void'
import { useCallback } from 'react'
import { useSketch } from '../../contexts/sketch'

export let ExportPanel = (props: { sketch: Sketch }) => {
  let { sketch } = props
  let sketchFile = useSketch()
  let onDownload = useCallback(
    (type: FileType) => {
      let div = document.createElement('div')
      let s = Sketch.of(sketch.construct, div, {
        ...sketch.overrides,
        exporting: { type, quality: 1 },
      })

      Sketch.on(s, 'stop', async () => {
        let dataUri = await Sketch.save(s)
        let link = document.createElement('a')
        let { path } = sketchFile
        let index = path.lastIndexOf('/')
        let [name, ext] = path.slice(index + 1).split('.')
        link.href = dataUri
        link.download = `${name}.${type}`
        link.click()
      })

      Sketch.play(s)
    },
    [sketch, sketchFile]
  )

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
          onClick={() => onDownload('png')}
        >
          <MdOutlineImage className="text-base" /> <span>PNG</span>
        </button>
        <button
          className={`
            flex-1 flex w-7 h-7 items-center justify-center space-x-1 rounded
            text-gray-400 border border-gray-200 hover:border-black hover:text-black
          `}
          onClick={() => onDownload('svg')}
        >
          <MdPhotoFilter className="text-base" /> <span>SVG</span>
        </button>
        <button
          className={`
            flex-1 flex w-7 h-7 items-center justify-center space-x-1 rounded
            text-gray-400 border border-gray-200 hover:border-black hover:text-black
          `}
          onClick={() => onDownload('pdf')}
        >
          <MdOutlineFeed className="text-base" /> <span>PDF</span>
        </button>
      </div>
    </div>
  )
}
