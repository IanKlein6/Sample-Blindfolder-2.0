// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFolders: () => ipcRenderer.invoke('select-folders'),
  selectDestination: () => ipcRenderer.invoke('select-destination'),
  processFolders: (data) => ipcRenderer.invoke('process-folders', data),
  openFolder: (path) => ipcRenderer.invoke('open-folder', path)
});
