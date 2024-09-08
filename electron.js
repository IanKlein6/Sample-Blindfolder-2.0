const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs'); // Ensure this line works correctly after installing the module
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const isDev = require('electron-is-dev');

console.log("Created by Ian Klein and Jost Wiggering - Sample BlindFolder 2.0");

let mainWindow; // Ensure mainWindow is defined and accessible

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

ipcMain.handle('process-folders', async (event, { folders, destinationFolder, folderName, settings }) => {
  if (!folders || !destinationFolder || !folderName) {
    throw new Error('Invalid arguments');
  }

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
    const prefix = settings.namingPrefix || currentDate;

    for (let index = 0; index < allFiles.length; index++) {
      const filePath = allFiles[index];
      const fileName = path.basename(filePath);
      const newFilename = `${prefix}_sample_${index + 1}${path.extname(fileName)}`;
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

    const logFilename = `@{prefix}_Blindfolder_log`;

    if (settings.fileFormat === 'xlsx') {
      const workbook = new ExcelJS.Workbook();
      const sortedByBlind = workbook.addWorksheet('Sorted by Blind Samples');
      const sortedByOriginal = workbook.addWorksheet('Sorted by Original Samples');

      renameData.sort((a, b) => extractNumberForSorting(a['Blind Samples']) - extractNumberForSorting(b['Blind Samples']));
      sortedByBlind.addRow(['Blind Samples', 'Original Samples']);
      renameData.forEach(data => sortedByBlind.addRow([data['Blind Samples'], data['Original Samples']]));

      renameData.sort((a, b) => extractNumberForSorting(a['Original Samples']) - extractNumberForSorting(b['Original Samples']));
      sortedByOriginal.addRow(['Original Samples', 'Blind Samples']);
      renameData.forEach(data => sortedByOriginal.addRow([data['Original Samples'], data['Blind Samples']]));

      const excelFilename = path.join(outputFolder, `${logFilename}.xlsx`);
      await workbook.xlsx.writeFile(excelFilename);
      console.log('Excel file created at:', excelFilename);
      return excelFilename;
    } else if (settings.fileFormat === 'csv') {
      const csvContent = renameData.map(data => `${data['Original Samples']},${data['Blind Samples']}`).join('\n');
      const csvFilename = path.join(outputFolder, `${logFilename}.csv`);
      fs.writeFileSync(csvFilename, csvContent);
      console.log('CSV file created at:', csvFilename);
      return csvFilename;
    }
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
