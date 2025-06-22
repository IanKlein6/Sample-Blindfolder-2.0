// Electron and Node.js dependencies
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev'); 
require('./electron'); // IPC handlers

let mainWindow; 

// Function to create the main application window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800, 
    height: 600,
    icon: path.join(__dirname, 'images', 'Blindfolder_icon_square.png'), // Update path if needed
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Determine the URL to load based on the environment (development vs production)
  const startUrl = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'blindfolder-ui/build/index.html')}`; // Production build URL for React app

  console.log('Loading URL:', startUrl);
  mainWindow.loadURL(startUrl); // Load the appropriate URL in the browser window

  // If in development mode, open DevTools for debugging
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
  // Quit the app unless on macOS (macOS apps usually stay active until the user explicitly quits)
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle the 'activate' event, which is fired when the app is launched or re-activated (e.g., when clicking the app icon)
app.on('activate', () => {
  // Recreate the window if there are no windows open (macOS behavior)
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Optional: Opens DevTools automatically for debugging when app starts in development mode
// Uncomment this block if you want to start with DevTools open in detached mode
// app.on('ready', () => {
//   createWindow();
//   mainWindow.webContents.openDevTools({ mode: 'detach' });
// });

app.on('ready', createWindow); //created when the app is ready
