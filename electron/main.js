const { app, BrowserWindow, BrowserView, ipcMain, shell, Menu, session } = require('electron')
const path = require('path')
const agentServer = require('./agent-server')

// Load the bundled Next.js static export — works both in dev and when packaged
const OUT_DIR = app.isPackaged
  ? path.join(process.resourcesPath, 'out')
  : path.join(__dirname, '..', 'out')
const HOME_URL = `file://${OUT_DIR}/index.html`
const SECTION_URLS = {
  home: HOME_URL,
  bizbox: `file://${OUT_DIR}/dashboard/bizbox/index.html`,
  lifebud: `file://${OUT_DIR}/dashboard/lifebud/index.html`,
}

// Single-bar layout: just the toolbar row
const TOOLBAR_HEIGHT = 40
// AI side panel width (0 = hidden)
const PANEL_WIDTH = 380

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
    backgroundColor: '#f2f0fa',
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
    panelOpen: false,
    panelView: null,
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
    const view = s.views.get(s.activeTabId) ?? (s.activePinned && s.pinnedViews?.get(s.activePinned))
    if (view) updateViewBounds(mainWindow, view)
    updatePanelBounds(mainWindow)
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
    win.webContents.send('tab-url', { tabId: tab.id, url })
    const s = windowState.get(win.id)
    if (s?.activeTabId === tab.id) {
      win.webContents.send('nav-state', { canGoBack: view.webContents.canGoBack(), canGoForward: view.webContents.canGoForward() })
    }
  })

  view.webContents.on('did-navigate-in-page', (_, url) => {
    tab.url = url
    win.webContents.send('tab-url', { tabId: tab.id, url })
  })

  view.webContents.on('page-title-updated', (_, title) => {
    tab.title = title
    win.webContents.send('tab-title', { tabId: tab.id, title })
    win.setTitle(`${title} — ThriveOS`)
  })

  view.webContents.on('page-favicon-updated', (_, favicons) => {
    if (favicons.length) win.webContents.send('tab-favicon', { tabId: tab.id, favicon: favicons[0] })
  })

  view.webContents.on('did-start-loading', () => {
    tab.loading = true
    win.webContents.send('tab-loading', { tabId: tab.id, loading: true })
  })

  view.webContents.on('did-stop-loading', () => {
    tab.loading = false
    win.webContents.send('tab-loading', { tabId: tab.id, loading: false })
    const s = windowState.get(win.id)
    if (s?.activeTabId === tab.id) {
      win.webContents.send('nav-state', { canGoBack: view.webContents.canGoBack(), canGoForward: view.webContents.canGoForward() })
    }
  })

  view.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      win.webContents.send('open-tab', { url })
    }
    return { action: 'deny' }
  })

  return view
}

function getPanelWidth(win) {
  const s = windowState.get(win.id)
  return s?.panelOpen ? PANEL_WIDTH : 0
}

function updateViewBounds(win, view) {
  const { width, height } = win.getContentBounds()
  const panelW = getPanelWidth(win)
  view.setBounds({
    x: 0,
    y: TOOLBAR_HEIGHT,
    width: Math.max(0, width - panelW),
    height: Math.max(0, height - TOOLBAR_HEIGHT),
  })
}

function updatePanelBounds(win) {
  const s = windowState.get(win.id)
  if (!s?.panelView) return
  const { width, height } = win.getContentBounds()
  const panelW = getPanelWidth(win)
  if (panelW === 0) return
  s.panelView.setBounds({
    x: width - panelW,
    y: TOOLBAR_HEIGHT,
    width: panelW,
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

// Pinned tab navigation (Home / Bizbox / Lifebud)
ipcMain.on('navigate-pinned', (event, section) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  const s = windowState.get(win.id)
  if (!s) return
  const url = SECTION_URLS[section] ?? HOME_URL
  // Reuse or create the pinned view for this section
  let view = s.pinnedViews?.get(section)
  if (!view) {
    if (!s.pinnedViews) s.pinnedViews = new Map()
    view = new BrowserView({ webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true } })
    view.webContents.loadURL(url)
    // Emit loading state
    view.webContents.on('did-start-loading', () => win.webContents.send('tab-loading', { tabId: null, loading: true }))
    view.webContents.on('did-stop-loading', () => win.webContents.send('tab-loading', { tabId: null, loading: false }))
    s.pinnedViews.set(section, view)
  }
  s.activePinned = section
  s.activeTabId  = null
  win.setBrowserView(view)
  updateViewBounds(win, view)
  win.webContents.send('nav-state', { canGoBack: false, canGoForward: false })
})

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

ipcMain.on('stop', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  const s = win && windowState.get(win.id)
  s?.views.get(s.activeTabId)?.webContents.stop()
})

ipcMain.on('clip-to-section', (event, { section, url, note }) => {
  // Future: write clip to local storage / Supabase
  // For now, navigate to the target section so user sees it
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  const s = windowState.get(win.id)
  if (!s) return
  const dest = SECTION_URLS[section] ?? HOME_URL
  const view = s.views.get(s.activeTabId)
  if (view) view.webContents.loadURL(dest)
  s.activeSection = section
  win.webContents.send('active-section', section)
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

ipcMain.on('new-tab', (event, { tabId, url }) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  const s = windowState.get(win.id)
  if (!s) return

  const tab = { id: tabId, url, title: 'New Tab', loading: true }
  const view = createBrowserView(win, tab)
  s.tabs.push(tab)
  s.views.set(tab.id, view)
  s.activeTabId  = tab.id
  s.activePinned = null
  win.setBrowserView(view)
  updateViewBounds(win, view)
})

ipcMain.on('close-tab', (event, tabId) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  const s = windowState.get(win.id)
  if (!s) return

  const view = s.views.get(tabId)
  view?.webContents.destroy()
  s.views.delete(tabId)
  s.tabs = s.tabs.filter((t) => t.id !== tabId)
  // Renderer handles switching to the next tab via switch-tab IPC
})

ipcMain.on('switch-tab', (event, tabId) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  const s = windowState.get(win.id)
  if (s) switchToTab(win, s, tabId)
})

// AI side panel toggle
ipcMain.on('toggle-panel', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender)
  if (!win) return
  const s = windowState.get(win.id)
  if (!s) return

  s.panelOpen = !s.panelOpen

  if (s.panelOpen) {
    // Create panel view if needed
    if (!s.panelView) {
      const EXTENSION_DIR = app.isPackaged
        ? path.join(process.resourcesPath, 'extension')
        : path.join(__dirname, 'extension-dist')
      const panelUrl = `file://${EXTENSION_DIR}/sidepanel/index.html`
      s.panelView = new BrowserView({
        webPreferences: {
          contextIsolation: true,
          nodeIntegration: false,
          // Allow extension to call localhost API
          webSecurity: false,
        },
      })
      s.panelView.webContents.loadURL(panelUrl)
    }
    win.addBrowserView(s.panelView)
    updatePanelBounds(win)
  } else {
    if (s.panelView) win.removeBrowserView(s.panelView)
  }

  // Resize the page content
  const pageView = s.views.get(s.activeTabId) ?? (s.activePinned && s.pinnedViews?.get(s.activePinned))
  if (pageView) updateViewBounds(win, pageView)

  win.webContents.send('panel-state', { open: s.panelOpen })
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
          if (win) win.webContents.send('open-tab', { url: null })
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

app.whenReady().then(async () => {
  // Start local AI server (Claude proxy on port 3747)
  agentServer.createServer()

  buildMenu()
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  agentServer.stopServer()
  if (process.platform !== 'darwin') app.quit()
})
