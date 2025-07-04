const { shell, contextBridge, ipcRenderer } = require('electron');
const { app } = require('@electron/remote');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolders: () => ipcRenderer.invoke('select-folders'),
  selectDestination: () => ipcRenderer.invoke('select-destination'),
  processFolders: (data) => ipcRenderer.invoke('process-folders', data),
  openFolder: (path) => ipcRenderer.invoke('open-folder', path),
  openExternal: (url) => shell.openExternal(url),

  //Event listeners for menu items
  onMenuSelectFolders: (callback) => ipcRenderer.on('menu-select-folders', callback),
  onMenuSelectDestination: (callback) => ipcRenderer.on('menu-select-destination', callback),
});

contextBridge.exposeInMainWorld('appInfo', {
  version: app.getVersion()
});