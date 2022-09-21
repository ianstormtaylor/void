import { app } from 'electron'
import { IS_MAC } from '../shared/env'
import { initializeIpc } from './ipc'
import { initializeMenus } from './menus'
import { STATUS } from './status'
import { store } from './store'
import { Tab } from './tab'
import { Window } from './window'

// When the app is first started and ready.
app.on('ready', () => {
  console.log('Event: app.ready')

  if (!app.requestSingleInstanceLock()) {
    console.log('Quitting for single instance lock…')
    app.quit()
    return
  }

  initializeMenus(app)
  initializeIpc(app)

  let state = store.getState()
  let opened = false

  for (let t of Object.values(state.tabs)) {
    new Tab({
      id: t.id,
      path: t.path,
    })
  }

  for (let w of Object.values(state.windows)) {
    opened = true
    new Window({
      id: w.id,
      tabIds: w.tabIds,
      activeTabId: w.activeTabId,
    })
  }

  if (!opened) {
    new Window()
  }
})

// When all windows are closed, except on Mac where it stays active.
app.on('window-all-closed', () => {
  console.log('Event: app.window-all-closed')
  if (!IS_MAC) {
    app.quit()
  }
})

// When the app has been re-activated on Mac, after all windows were closed.
app.on('activate', () => {
  console.log('Event: app.activate')
  let window = Window.active()
  if (window) {
    window.browserWindow.focus()
  } else {
    console.log('activating new window…')
    new Window()
  }
})

app.on('before-quit', () => {
  console.log('Event: app.before-quit')
  STATUS.quitting = true
})

app.on('quit', () => {
  STATUS.quitting = false
})
