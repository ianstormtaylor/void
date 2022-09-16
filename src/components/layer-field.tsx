import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline'
import { capitalCase } from 'change-case'

export let LayerField = (props: {
  name: string
  fill?: string
  stroke?: string
  hidden: boolean
  toggle: () => void
}) => {
  let { name, fill, stroke, hidden, toggle } = props
  return (
    <div className="flex items-center -mx-2.5 py-1.5 px-2.5">
      <div className="flex flex-1 mr-2 items-center space-x-2">
        {fill == null ? (
          <div className="flex items-center w-3.5 h-3.5">
            <div className="flex-1 h-1" style={{ background: stroke }} />
          </div>
        ) : (
          <div
            className="w-3.5 h-3.5 border border-gray-300 rounded-full"
            style={{
              background: fill,
              borderColor: stroke,
              borderWidth: stroke == null ? 1 : 2,
            }}
          />
        )}
        <span>{capitalCase(name ?? 'Untitled Layer')}</span>
      </div>
      <button
        onClick={toggle}
        className={`
          flex w-7 h-7 -my-1.5 -mr-1.5 items-center justify-center text-gray-400 rounded
          hover:bg-gray-100
        `}
      >
        {hidden ? (
          <EyeOffIcon className="w-4 h-4" />
        ) : (
          <EyeIcon className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}
