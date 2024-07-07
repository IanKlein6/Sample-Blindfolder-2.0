// src/App.js
import React, { useState } from 'react';
import { CssBaseline, Container, Grid, Paper, CircularProgress, Backdrop } from '@mui/material';
import AppSelector from './components/AppSelector';
import MainAppView from './components/MainAppView';
import SettingsPanel from './components/SettingsPanel';
import FolderNameModal from './components/FolderNameModal';

const { ipcRenderer } = window.require('electron');

function App() {
  const [selectedApp, setSelectedApp] = useState('Sample Blindfolder');
  const [settings, setSettings] = useState({
    autoOpen: false,
    autoName: false,
    namingPrefix: '',
    fileFormat: 'xlsx',
  });
  const [folders, setFolders] = useState([]);
  const [destinationFolder, setDestinationFolder] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <Paper>
              <AppSelector selectedApp={selectedApp} setSelectedApp={setSelectedApp} />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper>
              <MainAppView
                selectedApp={selectedApp}
                folders={folders}
                onAddFolder={handleAddFolder}
                onRename={handleRename}
                onRemoveFolder={handleRemoveFolder}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper>
              <SettingsPanel settings={settings} setSettings={setSettings} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <FolderNameModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveFolderName}
      />
      <Backdrop style={{ zIndex: 1301 }} open={isProcessing}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default App;
