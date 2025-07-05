// App.js
import React, { useState, useMemo, useEffect } from 'react';
import { CssBaseline, Grid, Paper, CircularProgress, Backdrop, ThemeProvider } from '@mui/material';
import AppSelector from './components/AppSelector';
import MainAppView from './components/MainAppView';
import SettingsPanel from './components/SettingsPanel';
import FolderNameModal from './components/FolderNameModal';
import InstructionsModal from './components/InstructionsModal';
import { lightTheme, darkTheme } from './theme';
import { log, error } from './utils/logger';

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
          checkForUpdates: true,
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

  // Function to check for updates
  const runUpdateCheck = () => {
    window.electronAPI.getAppVersion().then((currentVersion) => {
      fetch("https://api.github.com/repos/IanKlein6/Sample-Blindfolder-2.0/releases/latest")
        .then(res => res.json())
        .then(data => {
          console.log("[BlindFolder] Full GitHub release data:", JSON.stringify(data, null, 2));

          if (!data?.tag_name) {
            console.warn("[BlindFolder] No release tag found in GitHub response:", data);
            return;
          }

          const latestVersion = data.tag_name.replace(/^v/, "");
          const ignoredVersion = localStorage.getItem('ignoredVersion');

          if (ignoredVersion === latestVersion) {
            console.log(`[BlindFolder] Update to v${latestVersion} is ignored by user`);
            return; // skip update prompt
          }

          if (latestVersion !== currentVersion) {
            const choice = window.confirm(
              `A new version is available (v${latestVersion}). You’re on v${currentVersion}.\n\nClick OK to open the download page.\nClick Cancel to be reminded later.`
            );

            if (choice) {
              window.electronAPI.openExternal(data.html_url);
            } else {
              const laterChoice = window.prompt(
                `Update Options:\nType:\n - "ignore" to skip this version\n - "later" to be reminded next time\n\nLeave empty to do nothing.`
              );

              if (laterChoice?.toLowerCase() === 'ignore') {
                localStorage.setItem('ignoredVersion', latestVersion);
                console.log(`[BlindFolder] User chose to ignore update v${latestVersion}`);
              } else {
                console.log(`[BlindFolder] User chose to be reminded later for v${latestVersion}`);
              }
            }
          }
        })
        .catch(err => {
          console.warn("[BlindFolder] Update check failed:", err);
        });
    });
  };

  // Initial update check
  useEffect(() => {
    if (settings.checkForUpdates) {
      runUpdateCheck();
    }
  }, [settings.checkForUpdates]);

  // Manual update check event listener
  useEffect(() => {
    const handler = () => runUpdateCheck();
    window.addEventListener('manual-check-update', handler);
    return () => window.removeEventListener('manual-check-update', handler);
  }, []);

  //Wire menu navigation to electron
  useEffect(() => {
    const ipc = window?.electronAPI;
    if (!ipc) return;

    const handleMenuSelectFolders = () => {
      console.log('[Renderer] Menu triggered folder select');
      handleAddFolder();
    };

    const handleMenuSelectDestination = () => {
      console.log('[Renderer] Menu triggered destination select');
      handleRename();
    };

    ipc.onMenuSelectFolders(handleMenuSelectFolders);
    ipc.onMenuSelectDestination(handleMenuSelectDestination);
  }, []);

  // Add selected folders from the user's file system
  const handleAddFolder = async () => {
    const selectedFolders = await window.electronAPI.selectFolders();
    log('Selected folders:', selectedFolders);
    setFolders([...folders, ...selectedFolders]);
  };

  // Initiate renaming process by selecting the destination folder
  const handleRename = async () => {
    if (folders.length === 0) {
      alert('No folders selected.');
      return;
    }

    const selectedDestination = await window.electronAPI.selectDestination();
    log('Selected destination folder:', selectedDestination);
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
      const excelFilePath = await window.electronAPI.processFolders({
        folders,
        destinationFolder,
        folderName,
        settings,
      });
      log('Excel file created at:', excelFilePath);
      alert(`Renaming process complete. Log saved to ${excelFilePath}`);

      // Automatically open the destination folder if setting is enabled
      if (settings.autoOpen) {
        await window.electronAPI.openFolder(destinationFolder);
      }
    } catch (err) {
      error('Error processing folders:', err);
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
