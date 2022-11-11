import { OutputType, Sketch } from 'void'
import { useCallback } from 'react'
import { useEntrypoint } from '../../contexts/entrypoint'
import { SidebarButton } from '../ui/sidebar-button'
import { SidebarPanel } from '../ui/sidebar-panel'
import { useSketch } from '../../contexts/sketch'

export let ExportPanel = () => {
  let sketch = useSketch()
  let entrypoint = useEntrypoint()
  let onDownload = useCallback(
    (type: OutputType) => {
      let div = document.createElement('div')
      let s = Sketch.of({
        construct: sketch.construct,
        container: div,
        hash: sketch.hash,
        traits: sketch.traits,
        layers: sketch.layers,
        config: sketch.config,
        output: { type, quality: 1 },
      })

      Sketch.on(s, 'stop', async () => {
        let dataUri = await Sketch.save(s)
        let link = document.createElement('a')
        let { path } = entrypoint
        let index = path.lastIndexOf('/')
        let [name, ext] = path.slice(index + 1).split('.')
        link.href = dataUri
        link.download = `${name}.${type}`
        link.click()
      })

      Sketch.play(s)
    },
    [sketch, entrypoint]
  )

  return (
    <SidebarPanel title="Export" initialExpanded={false}>
      <div className="flex space-x-2 py-2">
        <SidebarButton className="flex-1" onClick={() => onDownload('png')}>
          PNG
        </SidebarButton>
        <SidebarButton className="flex-1" onClick={() => onDownload('svg')}>
          SVG
        </SidebarButton>
      </div>
    </SidebarPanel>
  )
}
