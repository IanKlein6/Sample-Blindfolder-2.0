// Preload.js
const { contextBridge, ipcRenderer, shell } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolders: () => ipcRenderer.invoke('select-folders'),
  selectDestination: () => ipcRenderer.invoke('select-destination'),
  processFolders: (data) => ipcRenderer.invoke('process-folders', data),
  openFolder: (path) => ipcRenderer.invoke('open-folder', path),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),

  onMenuSelectFolders: (callback) => ipcRenderer.on('menu-select-folders', callback),
  onMenuSelectDestination: (callback) => ipcRenderer.on('menu-select-destination', callback),
});