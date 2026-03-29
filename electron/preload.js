const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('thriveAPI', {
  // Navigation
  navigate:       (url)     => ipcRenderer.send('navigate', url),
  goBack:         ()        => ipcRenderer.send('go-back'),
  goForward:      ()        => ipcRenderer.send('go-forward'),
  reload:         ()        => ipcRenderer.send('reload'),
  stop:           ()        => ipcRenderer.send('stop'),
  navigatePinned: (section) => ipcRenderer.send('navigate-pinned', section),

  // Tabs
  newTab:    (tabId, url) => ipcRenderer.send('new-tab', { tabId, url }),
  closeTab:  (tabId)      => ipcRenderer.send('close-tab', tabId),
  switchTab: (tabId)      => ipcRenderer.send('switch-tab', tabId),

  // Generic event listener (for renderer to subscribe to main-process events)
  on: (channel, cb) => {
    const allowed = ['tab-title','tab-url','tab-favicon','tab-loading','nav-state','toast','open-tab']
    if (!allowed.includes(channel)) return
    ipcRenderer.on(channel, (_, data) => cb(data))
  },
})
