import { createRoot } from 'react-dom/client'
import { useEffect, useMemo, useState } from 'react'
import { Editor } from './components/editor'
import { ModuleContext } from './contexts/module'
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import { useConfig } from './contexts/config'
import { Banner } from './components/banner'
import { Module, Settings } from '../void'
import { TabContext } from './contexts/tab'
import { SketchContext } from './contexts/sketch'
import { mergeWith } from 'lodash'
import { SettingsContext } from './contexts/settings'

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
  let [module, setModule] = useState<Module | null>(null)
  let tab = config.tabs[id!]
  let sketch = config.sketches[tab?.sketchId]

  useEffect(() => {
    if (sketch.entrypoint) {
      import(/* @vite-ignore */ sketch.entrypoint)
        .then((pkg) => setModule(pkg))
        .catch((e) => console.error(e))
    }
  }, [sketch])

  let settings = useMemo(() => {
    if (module == null) return null
    let ms = module.settings ?? {}
    let ts = tab.settings
    let s = Settings.merge(ms, ts)
    let r = Settings.resolve(s)
    // Resolve the schema from the module alone.
    let rms = Settings.resolve(ms)
    r.schema = rms.schema
    return r
  }, [tab, module])

  return (
    module &&
    settings && (
      <ModuleContext.Provider value={module}>
        <TabContext.Provider value={tab}>
          <SketchContext.Provider value={sketch}>
            <SettingsContext.Provider value={settings}>
              <Editor />
            </SettingsContext.Provider>
          </SketchContext.Provider>
        </TabContext.Provider>
      </ModuleContext.Provider>
    )
  )
}

let root = createRoot(document.getElementById('main')!)
root.render(<App />)
