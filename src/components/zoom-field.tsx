import { MdAdd, MdClose, MdRemove, MdSearch } from 'react-icons/md'
import { useSketchStore, useUpdateSketchStore } from '../contexts/sketch-store'

export let ZoomField = () => {
  let { zoom } = useSketchStore()
  let updateStore = useUpdateSketchStore()
  return (
    <div className="flex space-x-2 -mr-1.5">
      <div className="flex-1 flex items-center -mx-2 p-2 space-x-2">
        <div
          title="Zoom"
          className="-ml-0.5 text-base text-gray-400 select-none"
        >
          <MdSearch />
        </div>
        <div className="flex items-center space-x-2">
          <span>{zoom ? `${Math.round(zoom * 100)}%` : 'Fit'}</span>
        </div>
      </div>
      <div className="flex items-center">
        <button
          className={`
            flex w-7 h-7 items-center justify-center text-base rounded
            text-gray-400 hover:bg-gray-100
          `}
          onClick={() => {
            updateStore((s) => {
              s.zoom /= 2
            })
          }}
        >
          <MdRemove />
        </button>
        <button
          className={`
            flex w-7 h-7 items-center justify-center text-base rounded
            text-gray-400 hover:bg-gray-100
          `}
          onClick={() => {
            updateStore((s) => {
              s.zoom *= 2
            })
          }}
        >
          <MdAdd />
        </button>
        <button
          className={`
            flex w-7 h-7 items-center justify-center text-base rounded
            text-gray-400 hover:bg-gray-100
          `}
          onClick={() => {
            updateStore((s) => {
              delete s.zoom
            })
          }}
        >
          <MdClose />
        </button>
      </div>
    </div>
  )
}
