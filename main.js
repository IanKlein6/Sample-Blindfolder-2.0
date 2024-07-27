const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

// Include the electron.js file where IPC handlers are defined
require('./electron'); // Adjust the path if electron.js is in a different directory

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'blindfolder-ui/build/index.html')}`;

  console.log('Loading URL:', startUrl);
  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error(`Failed to load: ${errorDescription} (Code: ${errorCode})`);
  });

  mainWindow.webContents.on('crashed', (event) => {
    console.error('The webContents has crashed:', event);
  });

  mainWindow.webContents.on('unresponsive', () => {
    console.warn('The webContents is unresponsive');
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Finished loading');
  });

  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`Console message: ${message} (level: ${level}, line: ${line}, source: ${sourceId})`);
  });

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', () => {
  createWindow();
  mainWindow.webContents.openDevTools({ mode: 'detach' });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
