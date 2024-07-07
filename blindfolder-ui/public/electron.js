const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const isDev = require('electron-is-dev');

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

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../blindfolder-ui/build/index.html')}`
  );

  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle('select-folders', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'multiSelections'],
  });
  console.log('Selected folders:', result.filePaths);
  return result.filePaths;
});

ipcMain.handle('select-destination', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  console.log('Selected destination:', result.filePaths[0]);
  return result.filePaths[0];
});

ipcMain.handle('process-folders', async (event, folders, destinationFolder, folderName) => {
  const outputFolder = path.join(destinationFolder, folderName);
  console.log('Output folder:', outputFolder);
  
  try {
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
      console.log('Created output folder:', outputFolder);
    } else {
      console.log('Output folder already exists:', outputFolder);
    }

    const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const allFiles = [];

    for (const folder of folders) {
      const files = fs.readdirSync(folder).map(file => path.join(folder, file));
      allFiles.push(...files);
    }

    console.log('All files:', allFiles);

    shuffleArray(allFiles);

    const renameData = [];

    for (let index = 0; index < allFiles.length; index++) {
      const filePath = allFiles[index];
      const fileName = path.basename(filePath);
      const newFilename = `${currentDate}_sample_${index + 1}${path.extname(fileName)}`;
      const destinationPath = path.join(outputFolder, newFilename);

      try {
        fs.copyFileSync(filePath, destinationPath);
        console.log(`Copied file from ${filePath} to ${destinationPath}`);
        renameData.push({ 'Original Samples': fileName, 'Blind Samples': newFilename });
      } catch (err) {
        console.error(`Failed to copy file ${filePath} to ${destinationPath}:`, err);
      }
    }

    console.log('Rename data:', renameData);

    const workbook = new ExcelJS.Workbook();
    const sortedByBlind = workbook.addWorksheet('Sorted by Blind Samples');
    const sortedByOriginal = workbook.addWorksheet('Sorted by Original Samples');

    renameData.sort((a, b) => extractNumberForSorting(a['Blind Samples']) - extractNumberForSorting(b['Blind Samples']));
    sortedByBlind.addRow(['Blind Samples', 'Original Samples']);
    renameData.forEach(data => sortedByBlind.addRow([data['Blind Samples'], data['Original Samples']]));

    renameData.sort((a, b) => extractNumberForSorting(a['Original Samples']) - extractNumberForSorting(b['Original Samples']));
    sortedByOriginal.addRow(['Original Samples', 'Blind Samples']);
    renameData.forEach(data => sortedByOriginal.addRow([data['Original Samples'], data['Blind Samples']]));

    const excelFilename = path.join(outputFolder, 'Blindfold_log.xlsx');
    await workbook.xlsx.writeFile(excelFilename);

    console.log('Excel file created at:', excelFilename);

    return excelFilename;
  } catch (error) {
    console.error('Error processing folders:', error);
    throw error;
  }
});

ipcMain.handle('open-folder', async (event, folderPath) => {
  try {
    if (process.platform === 'win32') {
      exec(`start "" "${folderPath}"`);
    } else if (process.platform === 'darwin') {
      exec(`open "${folderPath}"`);
    } else {
      exec(`xdg-open "${folderPath}"`);
    }
    console.log('Opened folder:', folderPath);
  } catch (err) {
    console.error(`Failed to open folder ${folderPath}:`, err);
  }
});

function extractNumberForSorting(filename) {
  const match = filename.match(/\d+/g);
  return match ? parseInt(match[0], 10) : 0;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
