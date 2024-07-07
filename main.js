const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const os = require('os');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

let mainWindow;

function createWindow() {
  console.log("1. Creating window");
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');
}

app.on('ready', () => {
  console.log("2. App is ready");
  createWindow();
});

app.on('window-all-closed', () => {
  console.log("3. All windows closed");
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  console.log("4. App activated");
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('select-folders', async () => {
  console.log("5. Select folders handler");
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'multiSelections'],
  });
  console.log('6. Selected folders:', result.filePaths);
  return result.filePaths;
});

ipcMain.handle('select-destination', async () => {
  console.log("7. Select destination handler");
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  console.log('8. Selected destination:', result.filePaths[0]);
  return result.filePaths[0];
});

ipcMain.handle('process-folders', async (event, folders, destinationFolder, folderName) => {
  console.log("9. Process folders handler");
  console.log(`10. Folders: ${folders}, Destination: ${destinationFolder}, Folder Name: ${folderName}`);
  const outputFolder = path.join(destinationFolder, folderName);
  console.log(`11. Output folder: ${outputFolder}`);

  try {
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
      console.log(`12. Created output folder: ${outputFolder}`);
    } else {
      console.log(`13. Output folder already exists: ${outputFolder}`);
    }

    const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const allFiles = [];

    for (const folder of folders) {
      const files = fs.readdirSync(folder).map(file => path.join(folder, file));
      allFiles.push(...files);
    }

    console.log(`14. All files: ${allFiles}`);

    shuffleArray(allFiles);

    const renameData = [];

    for (let index = 0; index < allFiles.length; index++) {
      const filePath = allFiles[index];
      const fileName = path.basename(filePath);
      const newFilename = `${currentDate}_sample_${index + 1}${path.extname(fileName)}`;
      const destinationPath = path.join(outputFolder, newFilename);

      try {
        fs.copyFileSync(filePath, destinationPath);
        console.log(`15. Copied file from ${filePath} to ${destinationPath}`);
        renameData.push({ 'Original Samples': fileName, 'Blind Samples': newFilename });
      } catch (err) {
        console.error(`16. Failed to copy file ${filePath} to ${destinationPath}:`, err);
      }
    }

    console.log(`17. Rename data: ${JSON.stringify(renameData)}`);

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

    console.log(`18. Excel file created at: ${excelFilename}`);

    return excelFilename;
  } catch (error) {
    console.error('19. Error processing folders:', error);
    throw error;
  }
});

ipcMain.handle('open-folder', async (event, folderPath) => {
  console.log("20. Open folder handler");
  try {
    if (process.platform === 'win32') {
      exec(`start "" "${folderPath}"`);
    } else if (process.platform === 'darwin') {
      exec(`open "${folderPath}"`);
    } else {
      exec(`xdg-open "${folderPath}"`);
    }
    console.log(`21. Opened folder: ${folderPath}`);
  } catch (err) {
    console.error(`22. Failed to open folder ${folderPath}:`, err);
  }
});

function extractNumberForSorting(filename) {
  console.log("23. Extract number for sorting");
  const match = filename.match(/\d+/g);
  return match ? parseInt(match[0], 10) : 0;
}

function shuffleArray(array) {
  console.log("24. Shuffle array");
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
