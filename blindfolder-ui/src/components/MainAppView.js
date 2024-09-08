import React from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import DarkLogo from '../assets/Blindfolder_logo.png'; // Logo for light mode
import LightLogo from '../assets/Blindfolder_logo_white_2.png'; // Logo for dark mode

function MainAppView({ selectedApp, folders, onAddFolder, onRename, onRemoveFolder, settings }) {
  const theme = useTheme(); // Access current theme (light/dark mode)

  // Determine which logo to display based on the dark mode setting
  const logoDisplay = settings.darkMode ? LightLogo : DarkLogo;

  return (
    <Box sx={{ padding: 5, backgroundColor: 'background.paperlight', height: '100%' }}>
      {/* Display logo */}
      <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
        <img src={logoDisplay} alt="Blindfolder Logo" style={{ width: '80%', height: 'auto' }} />
      </Box>

      {/* Buttons for adding folders and renaming */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        {/* Add Folder Button */}
        <Button
          variant="contained"
          onClick={onAddFolder}
          sx={{ 
            backgroundColor: theme.palette.custom.button1.background, 
            color: theme.palette.custom.button1.fontcolor, 
            '&:hover': { backgroundColor: theme.palette.custom.button2.background } 
          }}
        >
          Add Folder
        </Button>
        
        {/* Rename Button */}
        <Button
          variant="contained"
          onClick={onRename}
          sx={{ 
            backgroundColor: theme.palette.custom.button1.background, 
            color: theme.palette.custom.button1.fontcolor, 
            '&:hover': { backgroundColor: theme.palette.custom.button2.background } 
          }}
        >
          Rename
        </Button>
      </Box>

      {/* Display list of selected folders */}
      <Box sx={{ marginTop: 2 }}>
        {folders.map((folder, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
            {/* Display folder name */}
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              {folder}
            </Typography>

            {/* Remove Folder Button */}
            <Button
              variant="outlined"
              onClick={() => onRemoveFolder(index)}
              sx={{ 
                borderColor: theme.palette.custom.button1.background, 
                color: theme.palette.custom.button1.color, 
                borderWidth: 2, 
                '&:hover': { 
                  borderColor: theme.palette.custom.button2.background, 
                  color: theme.palette.custom.button2.color, 
                  borderWidth: 2, 
                } 
              }}
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
