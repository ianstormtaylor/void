import { SeedPanel } from './panels/seed-panel'
import { ExportPanel } from './panels/export-panel'
import { TraitPanel } from './panels/trait-panel'
import { LayoutPanel } from './panels/layout-panel'
import { ResolvedSettings, Scene, Schema, Traits } from '../../void'

export let EditorSidebar = (props: {
  scene: Scene | null
  schema: Schema | null
  settings: ResolvedSettings | null
  traits: Traits | null
}) => {
  let { schema, scene, settings, traits } = props
  return (
    <div className="text-xs">
      {scene && settings && schema && traits && (
        <>
          <LayoutPanel settings={settings} />
          <div className="border-t border-gray-200" />
          <SeedPanel scene={scene} />
          <div className="border-t border-gray-200" />
          <TraitPanel schema={schema} traits={traits} />
          <div className="border-t border-gray-200" />
          <ExportPanel scene={scene} traits={traits} />
        </>
      )}
    </div>
  )
}
