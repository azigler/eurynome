const electron = require('electron')

const { app, BrowserWindow, Menu, Tray } = electron
app.allowRendererProcessReuse = true

let shutdown = false
let window = null

if (!app.isPackaged) {
  process.env.DEVELOPMENT = true
  /* eslint-disable no-useless-escape */
  require('electron-reload')(process.cwd(), {
    electron: './node_modules/.bin/electron',
    ignored: /build|[\/\\]\./
  })
  /* eslint-enable no-useless-escape */
}

if (process.platform === 'darwin' || process.platform === 'win32') {
  app.on('before-quit', () => {
    shutdown = true
  })
  app.on('activate', () => {
    if (window.isVisible()) {
      window.focus()
    } else {
      window.show()
    }
  })
}

if (process.platform === 'win32') {
  Menu.setApplicationMenu(null)
}

if (process.platform === 'win32') {
  const path = require('path')
  const iconPath = path.join(__dirname, '/build/icon.png')

  let tray = null
  app.whenReady().then(() => {
    tray = new Tray(iconPath)

    const contextMenu = Menu.buildFromTemplate([
      { label: 'Quit', type: 'normal', click: () => { app.quit() } }
    ])

    tray.setToolTip('euryno.me')

    tray.setContextMenu(contextMenu)

    tray.on('click', () => {
      toggleWindow()
    })
  })
}

app.whenReady().then(() => {
  createWindow()
})

const createWindow = () => {
  window = new BrowserWindow({
    width: 1280,
    height: 720,
    useContentSize: true,
    title: 'euryno.me',
    resizable: false,
    fullscreenable: false,
    center: true,
    backgroundColor: '#000',
    webPreferences: {
      nodeIntegration: true,
      devTools: !app.isPackaged,
      accessibleTitle: 'euryno.me'
    }
  })

  if (process.platform === 'darwin' || process.platform === 'win32') {
    window.on('close', (event) => {
      if (!shutdown) {
        event.preventDefault()
        toggleWindow()
      }
    })
  }

  if (!app.isPackaged) window.webContents.openDevTools({ mode: 'detach' })

  window.loadFile('./index.html')
}

const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
  } else {
    window.show()
  }
}
