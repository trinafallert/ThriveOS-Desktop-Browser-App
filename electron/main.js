const { app, BrowserWindow, BrowserView, ipcMain, shell, Menu } = require('electron')
const path = require('path')

// ThriveOS section URLs — update HOME_URL to your deployed Cloudflare Pages URL
const HOME_URL = 'https://thriveos-bizbox-lifebud.pages.dev'
const SECTION_URLS = {
  home: HOME_URL,
  bizbox: `${HOME_URL}/dashboard/bizbox`,
  lifebud: `${HOME_URL}/dashboard/lifebud`,
}

// Chrome-style tab bar + ThriveOS section tabs + nav toolbar
// Layout: [ThriveOS section tabs row] [browser tabs + nav row]
const SECTION_BAR_HEIGHT = 44  // top row: My Home / Bizbox / Lifebud
const TAB_BAR_HEIGHT = 40      // second row: browser tabs + nav + address
const TOOLBAR_HEIGHT = SECTION_BAR_HEIGHT + TAB_BAR_HEIGHT

// Per-window state
const windowState = new Map()

let tabIdCounter = 1

function createTab(url) {
  return { id: tabIdCounter++, url, title: 'New Tab', loading: false }
}

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
    backgroundColor: '#0f0a1a',
    show: false,
    icon: path.join(__dirname, 'build', 'icons', 'icon.png'),
  })

  // Initial tab
  const firstTab = createTab(HOME_URL)
  const firstView = createBrowserView(mainWindow, firstTab)

  const state = {
    tabs: [firstTab],
    activeTabId: firstTab.id,
    views: new Map([[firstTab.id, firstView]]),
    activeSection: 'home',
  }
  windowState.set(mainWindow.id, state)

  mainWindow.setBrowserView(firstView)
  updateViewBounds(mainWindow, firstView)

  // Load chrome UI
  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'))

  mainWindow.webContents.on('did-finish-load', () => {
    sendTabsState(mainWindow)
    mainWindow.webContents.send('url-changed', HOME_URL)
    mainWindow.webContents.send('nav-state', { canGoBack: false, canGoForward: false })
    mainWindow.webContents.send('active-section', 'home')
  })

  mainWindow.on('resize', () => {
    const s = windowState.get(mainWindow.id)
    if (!s) return
    const view = s.views.get(s.activeTabId)
    if (view) updateViewBounds(mainWindow, view)
  })

  mainWindow.once('ready-to-show', () => mainWindow.show())
  mainWindow.on('closed', () => {
    const s = windowState.get(mainWindow.id)
    if (s) s.views.forEach((v) => v.webContents.destroy())
    windowState.delete(mainWindow.id)
  })

  return mainWindow
}

function createBrowserView(win, tab) {
  const view = new BrowserView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  view.webContents.loadURL(tab.url)

  view.webContents.on('did-navigate', (_, url) => {
    tab.url = url
    const s = windowState.get(win.id)
    if (!s || s.activeTabId !== tab.id) return
    win.webContents.send('url-changed', url)
    win.webContents.send('nav-state', {
      canGoBack: view.webContents.canGoBack(),
      canGoForward: view.webContents.canGoForward(),
    })
    sendTabsState(win)
  })

  view.webContents.on('did-navigate-in-page', (_, url) => {
    tab.url = url
    const s = windowState.get(win.id)
    if (!s || s.activeTabId !== tab.id) return
    win.webContents.send('url-changed', url)
    sendTabsState(win)
  })

  view.webContents.on('page-title-updated', (_, title) => {
    tab.title = title
    win.setTitle(`${title} — ThriveOS`)
    sendTabsState(win)
  })

  view.webContents.on('did-start-loading', () => {
    tab.loading = true
    const s = windowState.get(win.id)
    if (!s || s.activeTabId !== tab.id) return
    win.webContents.send('loading', true)
    sendTabsState(win)
  })

  view.webContents.on('did-stop-loading', () => {
    tab.loading = false
    const s = windowState.get(win.id)
    if (!s || s.activeTabId !== tab.id) return
    win.webContents.send('loading', false)
    win.webContents.send('nav-state', {
      canGoBack: view.webContents.canGoBack(),
      canGoForward: view.webContents.canGoForward(),
    })
    sendTabsState(win)
  })

  view.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      // Open in new tab
      const s = windowState.get(win.id)
      if (s) openNewTab(win, s, url)
    }
    return { action: 'deny' }
  })

  return view
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

function sendTabsState(win) {
  const s = windowState.get(win.id)
  if (!s) return
  const tabData = s.tabs.map((t) => ({
    id: t.id,
    url: t.url,
    title: t.title || 'New Tab',
    loading: t.loading,
    active: t.id === s.activeTabId,
  }))
  win.webContents.send('tabs-changed', tabData)
  win.webContents.send('active-tab-changed', s.activeTabId)
}

function openNewTab(win, s, url = 'https://www.google.com') {
  const tab = createTab(url)
  const view = createBrowserView(win, tab)
  s.tabs.push(tab)
  s.views.set(tab.id, view)
  switchToTab(win, s, tab.id)
}

function switchToTab(win, s, tabId) {
  const view = s.views.get(tabId)
  if (!view) return
  s.activeTabId = tabId
  win.setBrowserView(view)
  updateViewBounds(win, view)
  const tab = s.tabs.find((t) => t.id === tabId)
  win.webContents.send('url-changed', tab?.url ?? '')
  win.webContents.send('nav-state', {
    canGoBack: view.webContents.canGoBack(),
    canGoForward: view.webContents.canGoForward(),
  })
  sendTabsState(win)
}

// ── IPC handlers ──────────────────────────────────────────────────────────────

ipcMain.on('navigate', (event, url) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  const s = windowState.get(win.id)
  if (!s) return
  const view = s.views.get(s.activeTabId)
  if (!view) return

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    const isUrl = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(url)
    url = isUrl ? `https://${url}` : `https://www.google.com/search?q=${encodeURIComponent(url)}`
  }
  view.webContents.loadURL(url)
})

ipcMain.on('go-back', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  const s = win && windowState.get(win.id)
  const view = s?.views.get(s.activeTabId)
  if (view?.webContents.canGoBack()) view.webContents.goBack()
})

ipcMain.on('go-forward', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  const s = win && windowState.get(win.id)
  const view = s?.views.get(s.activeTabId)
  if (view?.webContents.canGoForward()) view.webContents.goForward()
})

ipcMain.on('reload', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  const s = win && windowState.get(win.id)
  s?.views.get(s.activeTabId)?.webContents.reload()
})

ipcMain.on('go-home', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  const s = win && windowState.get(win.id)
  const view = s?.views.get(s.activeTabId)
  view?.webContents.loadURL(HOME_URL)
  if (s) s.activeSection = 'home'
  win?.webContents.send('active-section', 'home')
})

ipcMain.on('go-to-section', (event, section) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  const s = windowState.get(win.id)
  if (!s) return
  const url = SECTION_URLS[section] ?? HOME_URL
  const view = s.views.get(s.activeTabId)
  if (view) view.webContents.loadURL(url)
  s.activeSection = section
  win.webContents.send('active-section', section)
})

ipcMain.on('new-tab', (event, url) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  const s = windowState.get(win.id)
  if (s) openNewTab(win, s, url)
})

ipcMain.on('close-tab', (event, tabId) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  const s = windowState.get(win.id)
  if (!s || s.tabs.length <= 1) return

  const idx = s.tabs.findIndex((t) => t.id === tabId)
  if (idx === -1) return

  const view = s.views.get(tabId)
  view?.webContents.destroy()
  s.views.delete(tabId)
  s.tabs.splice(idx, 1)

  if (s.activeTabId === tabId) {
    const newTab = s.tabs[Math.max(0, idx - 1)]
    switchToTab(win, s, newTab.id)
  } else {
    sendTabsState(win)
  }
})

ipcMain.on('switch-tab', (event, tabId) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  const s = windowState.get(win.id)
  if (s) switchToTab(win, s, tabId)
})

ipcMain.handle('get-current-url', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return HOME_URL
  const s = windowState.get(win.id)
  const tab = s?.tabs.find((t) => t.id === s.activeTabId)
  return tab?.url ?? HOME_URL
})

// ── App menu ──────────────────────────────────────────────────────────────────

function buildMenu() {
  const template = [
    ...(process.platform === 'darwin'
      ? [{
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
        }]
      : []),
    {
      label: 'File',
      submenu: [
        { label: 'New Tab', accelerator: 'CmdOrCtrl+T', click: (_, win) => {
          const s = win && windowState.get(win.id)
          if (s) openNewTab(win, s)
        }},
        { label: 'New Window', accelerator: 'CmdOrCtrl+N', click: () => createWindow() },
        { type: 'separator' },
        process.platform === 'darwin' ? { role: 'close' } : { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' }, { role: 'redo' }, { type: 'separator' },
        { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: (_, win) => {
          const s = win && windowState.get(win.id)
          s?.views.get(s.activeTabId)?.webContents.reload()
        }},
        { type: 'separator' },
        { role: 'togglefullscreen' },
        { role: 'toggleDevTools' },
      ],
    },
    { label: 'Window', submenu: [{ role: 'minimize' }, { role: 'zoom' }] },
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
