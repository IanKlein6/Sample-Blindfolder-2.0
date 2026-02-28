// Preload.js 
/** Preload script - security bridge between the renderer and main process.
 * Runs in the renderer process context but has access to Node.js APIs. 
 * Uses Electron's contextBridge to create a secure communication channel between the renderer and main processes. Allows the React app to invoke IPC handlers defined in the main process without exposing Node.js APIs directly to the renderer. 
 * Prevents security vulnerabilities while enabling folder selection, file processing, and other OS interactions. 
 * 
 * Flow:
 *    React UI (Renderer) -> contextBridge(preload) -> IPC -> Main Process -> OS
 */

const { contextBridge, ipcRenderer } = require('electron');

/** Exposes Electrons API's to the renderer process (React UI). Functions preform OS-level operations sending IPC messages to main process. 
 * selectFolders: Select folders to be processed.
 *    Opens OS folder picker, allows for multi folder select. Returns a Promise resolves into an array of the paths of the selected folders. 
 * 
 * selectDestination: Select destination for processed files
 *    Opens OS folder picker, allows for selecting one single destination folder. Returns a Promise resolving to a array of the path of the selected folder. 
 * 
 * processFiles: Sends files to be processed in main
 *    Sends folder data to the main process to blind (anonymize) the files via IPC. @param {Object} data - folders, destinationFolder, folderName, and settings for processing. Returns a Promise that resolves to the path of the generated log (Excel/CSV) file.
 * 
 * openFolder: Opens Destination folder in the OS. 
 *    @param {string} path - Path to destination folder. Returns Promise that resolves when folder is opened. 
 * 
 * getAppVersion: Checks for updates
 *    Retrieves App version number from package.json. Compares against latest Github Release to notify user of an available update. Returns a Promise resolving to the version string (e.g. "2.0.0")
 * 
 * openExternal: Opens URL in the systems default browser. 
 *    @param {string} url - The URL open (PayPal donation link)
 * 
 * onMenuSelectFolders: Listens for the user to click File > Select Folder(s) in the native app menu bar (or press Cmd+0 / Ctrl+0). Fires callback to trigger folder selection in the UI. @param {Function} callback - Function to execute when the menu action is triggered. 
 * 
 * onMenuSelectDestination: Listens for the user to click File > Select Destination in the native app menu bar (or press Cmd+D / Ctrl+d). Fires callback to trigger selection of destination folder in the UI. @param {Function} callback - Function to execute when the menu action is triggered. 
 */
contextBridge.exposeInMainWorld('electronAPI', {
  selectFolders: () => ipcRenderer.invoke('select-folders'), 
  selectDestination: () => ipcRenderer.invoke('select-destination'), 
  processFiles: (data) => ipcRenderer.invoke('process-folders', data),  
  openFolder: (path) => ipcRenderer.invoke('open-folder', path),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'), 
  openExternal: (url) => ipcRenderer.invoke('open-external', url), 

  onMenuSelectFolders: (callback) => ipcRenderer.on('menu-select-folders', callback),
  onMenuSelectDestination: (callback) => ipcRenderer.on('menu-select-destination', callback),
});