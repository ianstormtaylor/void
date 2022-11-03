import { capitalCase } from 'change-case'
import {
  MdClear,
  MdOutlineLayers,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from 'react-icons/md'
import { Sketch } from 'void'
import { useTab } from '../../contexts/tab'
import { IconButton } from '../ui/icon-button'
import { SidebarPanel } from '../ui/sidebar-panel'

export let LayersPanel = (props: { sketch: Sketch }) => {
  let { sketch } = props
  let [tab, changeTab] = useTab()
  let hasHiddens = Object.keys(tab.layers).length > 0
  return (
    <SidebarPanel
      title="Layers"
      buttons={
        <>
          <IconButton
            title="Show All"
            className={hasHiddens ? 'flex' : 'hidden'}
            onClick={() => {
              changeTab((t) => {
                t.layers = {}
              })
            }}
          >
            <MdClear />
          </IconButton>
        </>
      }
    >
      {Object.keys(sketch.layers)
        .slice()
        .reverse()
        .map((key) => {
          let hidden = tab.layers?.[key]?.hidden
          let label = capitalCase(key)
          return (
            <div
              key={key}
              className="group flex items-center -mr-2 space-x-1.5"
            >
              <div
                title="Dimensions"
                className={`
                -ml-0.5 text-base select-none
                ${hidden ? 'text-gray-300' : 'text-gray-400 '}
        `}
              >
                <MdOutlineLayers />
              </div>
              <div
                className={`
                flex-1 mr-3
                ${hidden ? 'text-gray-400 opacity-70' : 'text-black'}
              `}
              >
                {label}
              </div>
              <div className=" flex -mr-2">
                <IconButton
                  title={hidden ? 'Show' : 'Hide'}
                  active={hidden}
                  onClick={() => {
                    changeTab((t) => {
                      if (key in t.layers) {
                        delete t.layers[key]
                      } else {
                        t.layers[key] = { hidden: true }
                      }
                    })
                  }}
                >
                  {hidden ? (
                    <MdOutlineVisibilityOff />
                  ) : (
                    <MdOutlineVisibility />
                  )}
                </IconButton>
              </div>
            </div>
          )
        })}
    </SidebarPanel>
  )
}
