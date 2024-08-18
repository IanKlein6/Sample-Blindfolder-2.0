// src/App.js
import React, { useState, useMemo, useEffect } from 'react';
import { CssBaseline, Grid, Paper, CircularProgress, Backdrop, ThemeProvider } from '@mui/material';
import AppSelector from './components/AppSelector';
import MainAppView from './components/MainAppView';
import SettingsPanel from './components/SettingsPanel';
import FolderNameModal from './components/FolderNameModal';
import InstructionsModal from './components/InstructionsModal';
import { lightTheme, darkTheme } from './theme';


const { ipcRenderer } = window.require('electron');

function App() {
  const [selectedApp, setSelectedApp] = useState('');
  const [settings, setSettings] = useState({
    autoOpen: false,
    autoName: false,
    namingPrefix: '',
    fileFormat: 'xlsx',
    darkMode: false,
    showInstructions: true,
  });
  const [folders, setFolders] = useState([]);
  const [destinationFolder, setDestinationFolder] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);

  const theme = useMemo(() => (settings.darkMode ? darkTheme : lightTheme), [settings.darkMode]);

  useEffect(() => {
    if (!localStorage.getItem('disableInstructions')) {
      setIsInstructionsOpen(true);
    }
  }, []);

  const handleAddFolder = async () => {
    const selectedFolders = await ipcRenderer.invoke('select-folders');
    console.log('Selected folders:', selectedFolders);
    setFolders([...folders, ...selectedFolders]);
  };

  const handleRename = async () => {
    if (folders.length === 0) {
      alert('No folders selected.');
      return;
    }

    const selectedDestination = await ipcRenderer.invoke('select-destination');
    console.log('Selected destination folder:', selectedDestination);
    setDestinationFolder(selectedDestination);

    setIsModalOpen(true);
  };

  const handleSaveFolderName = async (folderName) => {
    if (!folderName) {
      alert('Folder name cannot be empty.');
      return;
    }

    setIsModalOpen(false);
    setIsProcessing(true);

    try {
      const excelFilePath = await ipcRenderer.invoke('process-folders', {
        folders,
        destinationFolder,
        folderName,
        settings,
      });
      console.log('Excel file created at:', excelFilePath);
      alert(`Renaming process complete. Log saved to ${excelFilePath}`);

      if (settings.autoOpen) {
        await ipcRenderer.invoke('open-folder', destinationFolder);
      }
    } catch (error) {
      console.error('Error processing folders:', error);
      alert('An error occurred while processing the folders. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFolder = (index) => {
    const newFolders = folders.filter((_, i) => i !== index);
    setFolders(newFolders);
  };

  const handleShowInstructions = () => {
    setIsInstructionsOpen(true);
  };

  const handleCloseInstructions = () => {
    setIsInstructionsOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container sx={{ height: '100vh' }}>
        <Grid item xs={12} md={3} sx={{ borderRight: '1px solid', borderColor: 'divider', padding: 0 }}>
          <Paper sx={{ height: '100%', padding: 2, backgroundColor: 'background.paperdark' }}>
            <AppSelector selectedApp={selectedApp} setSelectedApp={setSelectedApp} settings={settings}/>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} sx={{ borderRight: '1px solid', borderColor: 'divider', padding: 0 }}>
          <Paper sx={{ height: '100%', padding: 2, backgroundColor: 'background.paper' }}>
            <MainAppView
              selectedApp={selectedApp}
              folders={folders}
              onAddFolder={handleAddFolder}
              onRename={handleRename}
              onRemoveFolder={handleRemoveFolder}
              settings={settings}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3} sx={{ padding: 0 }}>
          <Paper sx={{ height: '100%', padding: 2, backgroundColor: 'background.paperdark' }}>
            <SettingsPanel settings={settings} setSettings={setSettings} onShowInstructions={handleShowInstructions} />
          </Paper>
        </Grid>
      </Grid>
      <FolderNameModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveFolderName}
      />
      <InstructionsModal
        open={isInstructionsOpen}
        onClose={handleCloseInstructions}
        onDisable={() => {
          setSettings({ ...settings, showInstructions: false });
          localStorage.setItem('disableInstructions', 'true');
        }}
      />
      <Backdrop style={{ zIndex: 1301 }} open={isProcessing}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </ThemeProvider>
  );
}

export default App;
