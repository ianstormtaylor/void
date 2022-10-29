import { FileType, Sketch } from 'void'
import { useCallback } from 'react'
import { useSketch } from '../../contexts/sketch'
import { SidebarButton } from '../ui/sidebar-button'
import { SidebarPanel } from '../ui/sidebar-panel'

export let ExportPanel = (props: { sketch: Sketch }) => {
  let { sketch } = props
  let sketchFile = useSketch()
  let onDownload = useCallback(
    (type: FileType) => {
      let div = document.createElement('div')
      let s = Sketch.of(sketch.construct, {
        el: div,
        overrides: sketch.overrides,
        output: { type, quality: 1 },
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
    <SidebarPanel title="Export">
      <div className="flex space-x-2 pt-2">
        <SidebarButton className="flex-1" onClick={() => onDownload('png')}>
          PNG
        </SidebarButton>
        <SidebarButton className="flex-1" onClick={() => onDownload('svg')}>
          SVG
        </SidebarButton>
        <SidebarButton className="flex-1" onClick={() => onDownload('pdf')}>
          PDF
        </SidebarButton>
      </div>
    </SidebarPanel>
  )
}
