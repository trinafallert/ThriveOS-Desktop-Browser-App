const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('thriveos', {
  // Navigation
  navigate: (url) => ipcRenderer.send('navigate', url),
  goBack: () => ipcRenderer.send('go-back'),
  goForward: () => ipcRenderer.send('go-forward'),
  reload: () => ipcRenderer.send('reload'),
  goHome: () => ipcRenderer.send('go-home'),
  getCurrentUrl: () => ipcRenderer.invoke('get-current-url'),

  // Tabs
  newTab: (url) => ipcRenderer.send('new-tab', url),
  closeTab: (tabId) => ipcRenderer.send('close-tab', tabId),
  switchTab: (tabId) => ipcRenderer.send('switch-tab', tabId),

  // Section navigation (ThriveOS special tabs)
  goToSection: (section) => ipcRenderer.send('go-to-section', section),

  // Stop loading
  stop: () => ipcRenderer.send('stop'),

  // Quick Clip — save current URL to Bizbox or Lifebud
  clipToSection: (section, url, note) => ipcRenderer.send('clip-to-section', { section, url, note }),

  // Events from main process
  onUrlChanged: (cb) => ipcRenderer.on('url-changed', (_, url) => cb(url)),
  onNavState: (cb) => ipcRenderer.on('nav-state', (_, state) => cb(state)),
  onLoading: (cb) => ipcRenderer.on('loading', (_, isLoading) => cb(isLoading)),
  onTabsChanged: (cb) => ipcRenderer.on('tabs-changed', (_, tabs) => cb(tabs)),
  onActiveTabChanged: (cb) => ipcRenderer.on('active-tab-changed', (_, tabId) => cb(tabId)),
  onActiveSection: (cb) => ipcRenderer.on('active-section', (_, section) => cb(section)),
})
