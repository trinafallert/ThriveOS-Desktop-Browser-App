const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('thriveos', {
  navigate: (url) => ipcRenderer.send('navigate', url),
  goBack: () => ipcRenderer.send('go-back'),
  goForward: () => ipcRenderer.send('go-forward'),
  reload: () => ipcRenderer.send('reload'),
  goHome: () => ipcRenderer.send('go-home'),
  getCurrentUrl: () => ipcRenderer.invoke('get-current-url'),

  onUrlChanged: (callback) => {
    ipcRenderer.on('url-changed', (_, url) => callback(url))
  },
  onNavState: (callback) => {
    ipcRenderer.on('nav-state', (_, state) => callback(state))
  },
  onLoading: (callback) => {
    ipcRenderer.on('loading', (_, isLoading) => callback(isLoading))
  },
})
