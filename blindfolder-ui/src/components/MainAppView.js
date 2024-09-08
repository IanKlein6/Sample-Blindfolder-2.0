// src/components/MainAppView.js
import React from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import DarkLogo from '../assets/Blindfolder_logo.png';
import LightLogo from '../assets/Blindfolder_logo_white_2.png' 

function MainAppView({ selectedApp, folders, onAddFolder, onRename, onRemoveFolder, settings }) {
  const theme = useTheme();

  const logoDisplay = settings.darkMode ? LightLogo : DarkLogo;

  return (
    <Box sx={{ padding: 5, backgroundColor: 'background.paperlight', height: '100%' }}>
      <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
        <img src={logoDisplay} alt="Blindfolder Logo" style={{ width: '80%', height: 'auto' }} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <Button
          variant="contained"
          onClick={onAddFolder}
          sx={{ backgroundColor: theme.palette.custom.button1.background, color: theme.palette.custom.button1.fontcolor, '&:hover': { backgroundColor: theme.palette.custom.button2.background } }}
        >
          Add Folder
        </Button>
        <Button
          variant="contained"
          onClick={onRename}
          sx={{ backgroundColor: theme.palette.custom.button1.background, color: theme.palette.custom.button1.fontcolor, '&:hover': { backgroundColor: theme.palette.custom.button2.background } }}
        >
          Rename
        </Button>
      </Box>
      <Box sx={{ marginTop: 2 }}>
        {folders.map((folder, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              {folder}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => onRemoveFolder(index)}
              sx={{ borderColor: theme.palette.custom.button1.background, color: theme.palette.custom.button1.color, borderWidth: 2, '&:hover': { borderColor: theme.palette.custom.button2.background, color: theme.palette.custom.button2.color, borderWidth: 2, } }}
            >
              Remove
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default MainAppView;
