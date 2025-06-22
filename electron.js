// Electron and Node.js dependencies
const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs'); 
const isDev = require('electron-is-dev');
const { log, error } = require('./utils/logger');

// Signature for code ownership
log("Created by Ian Klein and Jost Wiggering - BlindFolder 2.0");

let mainWindow; 

// Handler for folder selection (allows multiple folder selection)
ipcMain.handle('select-folders', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'multiSelections'],
  });
  log('Selected folders:', result.filePaths);
  return result.filePaths;
});

// Handler for destination folder selection
ipcMain.handle('select-destination', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  log('Selected destination:', result.filePaths[0]);
  return result.filePaths[0];
});

// Handler for processing folders and organizing files
ipcMain.handle('process-folders', async (event, { folders, destinationFolder, folderName, settings }) => {
  if (!folders || !destinationFolder || !folderName) {
    throw new Error('Invalid arguments: folders, destinationFolder, or folderName are missing');
  }

  // Create the output folder path
  const outputFolder = path.join(destinationFolder, folderName);
  log('Output folder:', outputFolder);
  
  try {
    // Create the output folder if it doesn't exist
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
      log('Created output folder:', outputFolder);
    } else {
      log('Output folder already exists:', outputFolder);
    }

    // Current date used for file naming
    const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const allFiles = [];

    // Collect all files from selected folders
    for (const folder of folders) {
      const files = fs.readdirSync(folder).map(file => path.join(folder, file));
      allFiles.push(...files);
    }

    log('All files:', allFiles);

    // Shuffle files randomly
    shuffleArray(allFiles);

    const renameData = [];
    const prefix = settings.namingPrefix || currentDate; // Use custom prefix or default to current date

    // Copy files to the destination folder with new names
    for (let index = 0; index < allFiles.length; index++) {
      const filePath = allFiles[index];
      const fileName = path.basename(filePath);
      const newFilename = `${prefix}_sample_${index + 1}${path.extname(fileName)}`;
      const destinationPath = path.join(outputFolder, newFilename);

      try {
        fs.copyFileSync(filePath, destinationPath);
        log(`Copied file from ${filePath} to ${destinationPath}`);
        renameData.push({ 'Original Samples': fileName, 'Blind Samples': newFilename });
      } catch (err) {
        error(`Failed to copy file ${filePath} to ${destinationPath}:`, err);
      }
    }

    log('Rename data:', renameData);

    const logFilename = `${prefix}_Blindfolder_log`; // Filename for logs (without extension)

    // Handle file saving based on settings (Excel or CSV)
    if (settings.fileFormat === 'xlsx') {
      const workbook = new ExcelJS.Workbook();
      const sortedByBlind = workbook.addWorksheet('Sorted by Blind Samples');
      const sortedByOriginal = workbook.addWorksheet('Sorted by Original Samples');

      // Sort and add data to Excel worksheet (sorted by Blind Samples)
      renameData.sort((a, b) => extractNumberForSorting(a['Blind Samples']) - extractNumberForSorting(b['Blind Samples']));
      sortedByBlind.addRow(['Blind Samples', 'Original Samples']);
      renameData.forEach(data => sortedByBlind.addRow([data['Blind Samples'], data['Original Samples']]));

      // Sort and add data to another worksheet (sorted by Original Samples)
      renameData.sort((a, b) => extractNumberForSorting(a['Original Samples']) - extractNumberForSorting(b['Original Samples']));
      sortedByOriginal.addRow(['Original Samples', 'Blind Samples']);
      renameData.forEach(data => sortedByOriginal.addRow([data['Original Samples'], data['Blind Samples']]));

      // Save as Excel file
      const excelFilename = path.join(outputFolder, `${logFilename}.xlsx`);
      await workbook.xlsx.writeFile(excelFilename);
      log('Excel file created at:', excelFilename);
      return excelFilename;
    } else if (settings.fileFormat === 'csv') {
      // Prepare CSV content and save as CSV file
      const csvContent = renameData.map(data => `${data['Original Samples']},${data['Blind Samples']}`).join('\n');
      const csvFilename = path.join(outputFolder, `${logFilename}.csv`);
      fs.writeFileSync(csvFilename, csvContent);
      log('CSV file created at:', csvFilename);
      return csvFilename;
    }
  } catch (error) {
    error('Error processing folders:', error);
    throw error;
  }
});

// Handler to open a folder in the system's file explorer
ipcMain.handle('open-folder', async (_event, folderPath) => {
  try {
    const result = await shell.openPath(folderPath);
    if (result) {
      error('Error opening folder:', result); // `result` contains the error message as a string
    } else {
      log('Opened folder:', folderPath);
    }
  } catch (err) {
    error('Exception while opening folder:', err);
  }
});

// Utility function: Extracts number from a filename for sorting
function extractNumberForSorting(filename) {
  const match = filename.match(/\d+/g);
  return match ? parseInt(match[0], 10) : 0;
}

// Utility function: Shuffle an array in place (Fisher-Yates shuffle)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
