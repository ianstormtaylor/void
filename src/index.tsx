import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import { Module } from '../electron/shared/engine/sketch'
import { Editor } from './components/editor'
import {
  SetSketchStoreContext,
  SketchStoreContext,
  useLoadSketchStore,
} from './contexts/sketch-store'
import { ModuleContext } from './contexts/module'
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import { useConfig } from './contexts/config'
import { Banner } from './components/banner'
import { SketchConfig, TabConfig } from 'electron/shared/config'

let App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/windows/:id" element={<WindowPage />} />
        <Route path="/tabs/:id" element={<TabPage />} />
      </Routes>
    </BrowserRouter>
  )
}

let WindowPage = () => {
  let { id } = useParams()
  let [config] = useConfig()
  let window = config.windows[id!]
  return window && <Banner key={window.id} window={window} />
}

let TabPage = () => {
  let { id } = useParams()
  let [config] = useConfig()
  let tab = config.tabs[id!]
  let sketch = config.sketches[tab?.sketchId]
  return tab && sketch && sketch.entrypoint ? (
    <Sketch
      key={tab.id}
      entrypoint={sketch.entrypoint}
      tab={tab}
      sketch={sketch}
    />
  ) : null
}

let Sketch = (props: {
  entrypoint: string
  tab: TabConfig
  sketch: SketchConfig
}) => {
  let { entrypoint, tab, sketch } = props
  let [module, setModule] = useState<Module | null>(null)
  let [store, setStore] = useLoadSketchStore(entrypoint)

  useEffect(() => {
    import(/* @vite-ignore */ entrypoint)
      .then((pkg) => setModule(pkg))
      .catch((e) => console.error(e))
  }, [entrypoint])

  useEffect(() => {
    electron.onRebuildSketch(sketch.id, () => {
      window.location.reload()
    })
  }, [sketch])

  return (
    module && (
      <ModuleContext.Provider value={module}>
        <SetSketchStoreContext.Provider value={setStore}>
          <SketchStoreContext.Provider value={store}>
            <Editor sketch={sketch} tab={tab} module={module} store={store} />
          </SketchStoreContext.Provider>
        </SetSketchStoreContext.Provider>
      </ModuleContext.Provider>
    )
  )
}

let root = createRoot(document.getElementById('main')!)
root.render(<App />)
