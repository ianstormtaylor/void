import { app } from 'electron'
import { IS_MAC } from './env'
import { initializeMenus } from './menus'
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
  new Window()
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

// When the app is being quit.
app.on('before-quit', () => {
  console.log('Event: app.before-quit')
  for (let tab of Tab.all()) {
    tab.stop()
  }
})
