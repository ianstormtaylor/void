import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import { Module } from './engine/sketch'
import { Editor } from './components/editor'
import {
  SetSketchStoreContext,
  SketchStoreContext,
  useLoadSketchStore,
} from './contexts/sketch-store'
import { ModuleContext } from './contexts/module'
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import { useConfig } from './contexts/config'
import { Banner } from './components/navigation'

let App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tabs/:id" element={<TabPage />} />
      </Routes>
    </BrowserRouter>
  )
}

let HomePage = () => {
  return <Banner />
}

let TabPage = () => {
  let { id } = useParams()
  let [config] = useConfig()
  let tab = config.tabs[id!]
  return tab && tab.entrypoint ? (
    <Sketch key={tab.id} entrypoint={tab.entrypoint} />
  ) : null
}

let Sketch = (props: { entrypoint: string }) => {
  let { entrypoint } = props
  let [module, setModule] = useState<Module | null>(null)
  let [store, setStore] = useLoadSketchStore(entrypoint)

  useEffect(() => {
    import(entrypoint)
      .then((pkg) => setModule(pkg))
      .catch((e) => console.error(e))
  }, [entrypoint])

  return (
    module && (
      <ModuleContext.Provider value={module}>
        <SetSketchStoreContext.Provider value={setStore}>
          <SketchStoreContext.Provider value={store}>
            <Editor module={module} store={store} />
          </SketchStoreContext.Provider>
        </SetSketchStoreContext.Provider>
      </ModuleContext.Provider>
    )
  )
}

let root = createRoot(document.getElementById('main')!)
root.render(<App />)
