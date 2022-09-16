import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import { Module } from './engine/sketch'
import { Editor } from './components/editor'
import { SetStoreContext, StoreContext, useLoadStore } from './contexts/store'
import { ModuleContext } from './contexts/module'

let App = () => {
  let [entrypoint, setEntrypoint] = useState<string | null>(null)
  let [module, setModule] = useState<Module | null>(null)

  useEffect(() => {
    electron.getEntrypoint().then((url) => {
      console.log('importing…', { url })
      setEntrypoint(url)
      import(url).then((pkg) => setModule(pkg)).catch((e) => console.error(e))
    })
  }, [])

  return module && entrypoint ? (
    <Loader module={module} entrypoint={entrypoint} />
  ) : null
}

let Loader = (props: { entrypoint: string; module: Module }) => {
  let { module, entrypoint } = props
  let [store, setStore] = useLoadStore(entrypoint)
  return (
    <ModuleContext.Provider value={module}>
      <SetStoreContext.Provider value={setStore}>
        <StoreContext.Provider value={store}>
          <Editor module={module} store={store} />
        </StoreContext.Provider>
      </SetStoreContext.Provider>
    </ModuleContext.Provider>
  )
}

let root = createRoot(document.getElementById('main')!)
root.render(<App />)
