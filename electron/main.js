const { app, BrowserWindow, BrowserView, ipcMain, shell, Menu } = require('electron')
const path = require('path')

const HOME_URL = 'https://thriveos-bizbox-lifebud.pages.dev'
const TOOLBAR_HEIGHT = 52

// Track views per window for tab support
const windowState = new Map()

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    backgroundColor: '#0f172a',
    show: false,
    icon: path.join(__dirname, 'build', 'icons', 'icon.png'),
  })

  // Create the web content view
  const view = new BrowserView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  mainWindow.setBrowserView(view)
  updateViewBounds(mainWindow, view)

  windowState.set(mainWindow.id, { view, currentUrl: HOME_URL })

  // Load toolbar UI
  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'))

  // Load ThriveOS homepage in the browser view
  view.webContents.loadURL(HOME_URL)

  // Handle window resize
  mainWindow.on('resize', () => updateViewBounds(mainWindow, view))

  // Send initial state once toolbar is ready
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('url-changed', HOME_URL)
    mainWindow.webContents.send('nav-state', {
      canGoBack: false,
      canGoForward: false,
    })
  })

  // Web content events
  view.webContents.on('did-navigate', (_, url) => {
    windowState.get(mainWindow.id).currentUrl = url
    mainWindow.webContents.send('url-changed', url)
    mainWindow.webContents.send('nav-state', {
      canGoBack: view.webContents.canGoBack(),
      canGoForward: view.webContents.canGoForward(),
    })
  })

  view.webContents.on('did-navigate-in-page', (_, url) => {
    windowState.get(mainWindow.id).currentUrl = url
    mainWindow.webContents.send('url-changed', url)
  })

  view.webContents.on('page-title-updated', (_, title) => {
    mainWindow.setTitle(`${title} — ThriveOS`)
  })

  view.webContents.on('did-start-loading', () => {
    mainWindow.webContents.send('loading', true)
  })

  view.webContents.on('did-stop-loading', () => {
    mainWindow.webContents.send('loading', false)
    mainWindow.webContents.send('nav-state', {
      canGoBack: view.webContents.canGoBack(),
      canGoForward: view.webContents.canGoForward(),
    })
  })

  // Open external links in default browser
  view.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url)
    }
    return { action: 'deny' }
  })

  mainWindow.once('ready-to-show', () => mainWindow.show())

  mainWindow.on('closed', () => {
    windowState.delete(mainWindow.id)
  })

  return mainWindow
}

function updateViewBounds(win, view) {
  const { width, height } = win.getContentBounds()
  view.setBounds({
    x: 0,
    y: TOOLBAR_HEIGHT,
    width,
    height: Math.max(0, height - TOOLBAR_HEIGHT),
  })
}

// IPC handlers
ipcMain.on('navigate', (event, url) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  const state = windowState.get(win.id)
  if (!state) return

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    // Check if it looks like a URL or a search query
    const isUrl = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(url)
    url = isUrl ? `https://${url}` : `https://www.google.com/search?q=${encodeURIComponent(url)}`
  }

  state.view.webContents.loadURL(url)
})

ipcMain.on('go-back', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  const state = windowState.get(win.id)
  if (state?.view.webContents.canGoBack()) state.view.webContents.goBack()
})

ipcMain.on('go-forward', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  const state = windowState.get(win.id)
  if (state?.view.webContents.canGoForward()) state.view.webContents.goForward()
})

ipcMain.on('reload', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  const state = windowState.get(win.id)
  state?.view.webContents.reload()
})

ipcMain.on('go-home', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  const state = windowState.get(win.id)
  state?.view.webContents.loadURL(HOME_URL)
})

ipcMain.handle('get-current-url', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return HOME_URL
  return windowState.get(win.id)?.currentUrl ?? HOME_URL
})

// App menu
function buildMenu() {
  const template = [
    ...(process.platform === 'darwin'
      ? [
          {
            label: 'ThriveOS',
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideOthers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' },
            ],
          },
        ]
      : []),
    {
      label: 'File',
      submenu: [
        {
          label: 'New Window',
          accelerator: 'CmdOrCtrl+N',
          click: () => createWindow(),
        },
        { type: 'separator' },
        process.platform === 'darwin' ? { role: 'close' } : { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: (_, win) => windowState.get(win?.id)?.view.webContents.reload(),
        },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { role: 'toggleDevTools' },
      ],
    },
    {
      label: 'Window',
      submenu: [{ role: 'minimize' }, { role: 'zoom' }],
    },
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

app.whenReady().then(() => {
  buildMenu()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
