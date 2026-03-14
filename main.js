// main.js 

/** Main entry point for the Electron window 
 * 
 * Functions:
 *  createWindow() - loads main electron window with size parameters and security preferences. 
 * 
 * IPC Handlers:
 *  open-external - Opens URL in the system's default browser (Paypal donation link).
 *  get-app-version - Returns the app version from package.json. Used for check for updates. 
 *  
 * Native Menu:
 *  template - Defines the app menu bar structure and keyboard shortcuts (includes macOS specific app menus).
 */
const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev'); 
const { setMainWindow } = require(path.join(__dirname, 'electron')); // IPC handlers
const { log } = require('./utils/logger');
console.log('[Blindfolder] Requiring electron.js');

let mainWindow; 

/** Main application window creation
 * Creates main window with predefined width, height, icon. 
 * Loads preload script, sets nodeIntegration security to false, contextIsolation to true, and enableRemoteModule to false. 
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800, 
    height: 600,
    icon: path.join(__dirname, 'images', 'Blindfolder_icon_square.png'), // Update path if needed
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // Security. disables remote content/code integration 
      contextIsolation: true,
      enableRemoteModule: false
    },
  });
  setMainWindow(mainWindow);

  // Render in Production or Developer mode (Developer enables DevTools for debugging)
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'blindfolder-ui/build/index.html')}`; // Production build URL for the React app

  console.log('Loading URL:', startUrl);
  mainWindow.loadURL(startUrl);

  // Opens DevTools for debugging
  if (isDev) {
    mainWindow.webContents.openDevTools();  
  }

  // Handle error when content fails to load 
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(`Failed to load: ${errorDescription} (Code: ${errorCode})`);
  });

  // Log if the webContents crashes 
  mainWindow.webContents.on('crashed', (event) => {
    console.error('The webContents has crashed:', event);
  });

  // Log if the webContents becomes unresponsive
  mainWindow.webContents.on('unresponsive', () => {
    console.warn('The webContents is unresponsive');
  });

  // Log when the content finishes loading
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Finished loading');
  });

  // Log console messages from the webContents (browser-side console)
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`Console message: ${message} (level: ${level}, line: ${line}, source: ${sourceId})`);
  });

  // Handle window close event
  mainWindow.on('closed', () => {
    mainWindow = null; // Dereference the window object to allow proper garbage collection
  });
}

// Handler for when all windows are closed
app.on('window-all-closed', () => {
  // Quit the app unless on macOS (macOS apps stay active until the user explicitly quits) 
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle the 'activate' event, which is fired when the app is launched or re-activated (e.g. when clicking the app icon)
app.on('activate', () => {
  // Recreate the window if there are no windows open (macOS behavior)
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const isMac = process.platform === 'darwin';

const template = [
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  {
    label: 'File',
    submenu: [
      {
        label: 'Select Folder(s)',
        accelerator: isMac ? 'Cmd+O' : 'Ctrl+O',
        click: () => {
          mainWindow.webContents.send('menu-select-folders');
        }
      },
      {
        label: 'Select Destination',
        accelerator: isMac ? 'Cmd+D' : 'Ctrl+D',
        click: () => {
          mainWindow.webContents.send('menu-select-destination');
        }
      },
      { type: 'separator' },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
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
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          await shell.openExternal('https://github.com/IanKlein6/Sample-Blindfolder-2.0');
        }
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// Optional: Opens DevTools automatically for debugging when app starts in development mode
// Uncomment this block if you want to start with DevTools open in detached mode
// app.on('ready', () => {
//   createWindow();
//   mainWindow.webContents.openDevTools({ mode: 'detach' });
// });

app.on('ready', createWindow); // Launch app once electron is ready.

// Opens URLs in external browser
ipcMain.handle('open-external', async (event, url) => {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:') {  
    log('Blocked non-https URL:', url);
    return;
  }
  await shell.openExternal(url);
});

// Returns app version from package.json
ipcMain.handle('get-app-version', async () => {
  return app.getVersion();
});

// Global error handling for main process
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Global error handling for promise rejection
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:', reason);
});
