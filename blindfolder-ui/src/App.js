import React, { useState, useMemo, useEffect } from 'react';
import { CssBaseline, Grid, Paper, CircularProgress, Backdrop, ThemeProvider } from '@mui/material';
import AppSelector from './components/AppSelector';
import MainAppView from './components/MainAppView';
import SettingsPanel from './components/SettingsPanel';
import FolderNameModal from './components/FolderNameModal';
import InstructionsModal from './components/InstructionsModal';
import { lightTheme, darkTheme } from './theme';

// Electron's ipcRenderer for communication between React and Electron
const { ipcRenderer } = window.require('electron');

function App() {

  // Load settings from localStorage or use default settings
  const loadSettings = () => {
    const savedSettings = localStorage.getItem('appSettings');
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
        autoOpen: false,
        autoName: false,
        namingPrefix: '',
        fileFormat: 'xlsx',
        darkMode: false,
        showInstructions: true,
      };
  };

  // State variables for managing app state
  const [selectedApp, setSelectedApp] = useState('');
  const [settings, setSettings] = useState(loadSettings());
  const [folders, setFolders] = useState([]);
  const [destinationFolder, setDestinationFolder] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(settings.showInstructions);

  // Memoized theme based on the darkMode setting
  const theme = useMemo(() => (settings.darkMode ? darkTheme : lightTheme), [settings.darkMode]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  // Add selected folders from the user's file system
  const handleAddFolder = async () => {
    const selectedFolders = await ipcRenderer.invoke('select-folders');
    console.log('Selected folders:', selectedFolders);
    setFolders([...folders, ...selectedFolders]);
  };

  // Initiate renaming process by selecting the destination folder
  const handleRename = async () => {
    if (folders.length === 0) {
      alert('No folders selected.');
      return;
    }

    const selectedDestination = await ipcRenderer.invoke('select-destination');
    console.log('Selected destination folder:', selectedDestination);
    setDestinationFolder(selectedDestination);

    setIsModalOpen(true); // Open modal to ask for a new folder name
  };

  // Handle saving the new folder name and start renaming process
  const handleSaveFolderName = async (folderName) => {
    if (!folderName) {
      alert('Folder name cannot be empty.');
      return;
    }

    setIsModalOpen(false);
    setIsProcessing(true); // Show processing indicator

    try {
      // Invoke Electron process to rename files in the folders
      const excelFilePath = await ipcRenderer.invoke('process-folders', {
        folders,
        destinationFolder,
        folderName,
        settings,
      });
      console.log('Excel file created at:', excelFilePath);
      alert(`Renaming process complete. Log saved to ${excelFilePath}`);

      // Automatically open the destination folder if setting is enabled
      if (settings.autoOpen) {
        await ipcRenderer.invoke('open-folder', destinationFolder);
      }
    } catch (error) {
      console.error('Error processing folders:', error);
      alert('An error occurred while processing the folders. Please try again.');
    } finally {
      setIsProcessing(false); // Hide processing indicator
    }
  };

  // Remove a folder from the list by index
  const handleRemoveFolder = (index) => {
    const newFolders = folders.filter((_, i) => i !== index);
    setFolders(newFolders);
  };

  // Show the instructions modal
  const handleShowInstructions = () => {
    setIsInstructionsOpen(true);
  };

  // Close the instructions modal
  const handleCloseInstructions = () => {
    setIsInstructionsOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container sx={{ height: '100vh' }}>
        {/* Left panel: App Selector */}
        <Grid item xs={12} md={3} sx={{ borderRight: '1px solid', borderColor: 'divider', padding: 0 }}>
          <Paper sx={{ height: '100%', padding: 2, backgroundColor: 'background.paperdark' }}>
            <AppSelector selectedApp={selectedApp} setSelectedApp={setSelectedApp} settings={settings} />
          </Paper>
        </Grid>

        {/* Middle panel: Main App View */}
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

        {/* Right panel: Settings Panel */}
        <Grid item xs={12} md={3} sx={{ padding: 0 }}>
          <Paper sx={{ height: '100%', padding: 2, backgroundColor: 'background.paperdark' }}>
            <SettingsPanel settings={settings} setSettings={setSettings} onShowInstructions={handleShowInstructions} />
          </Paper>
        </Grid>
      </Grid>

      {/* Modal for folder renaming */}
      <FolderNameModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveFolderName}
      />

      {/* Modal for instructions */}
      <InstructionsModal
        open={isInstructionsOpen}
        onClose={handleCloseInstructions}
        onDisable={() => {
          setSettings({ ...settings, showInstructions: false });
          localStorage.setItem('disableInstructions', 'true');
        }}
      />

      {/* Backdrop with loading spinner for the renaming process */}
      <Backdrop style={{ zIndex: 1301 }} open={isProcessing}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </ThemeProvider>
  );
}

export default App;
