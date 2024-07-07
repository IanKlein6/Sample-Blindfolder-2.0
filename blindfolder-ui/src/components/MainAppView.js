// src/components/MainAppView.js
import React from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';

function MainAppView({ selectedApp, folders, onAddFolder, onRename, onRemoveFolder }) {
  const theme = useTheme();

  return (
    <Box sx={{ padding: 5, backgroundColor: 'background.paperlight', height: '100%' }}>
      <Typography variant="h4" gutterBottom>
        {selectedApp}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <Button
          variant="contained"
          onClick={onAddFolder}
          sx={{ backgroundColor: theme.palette.custom.button1.background, color: theme.palette.custom.button1.fontcolor, '&:hover': { backgroundColor: theme.palette.custom.button1.background } }}
        >
          Add Folder
        </Button>
        <Button
          variant="contained"
          onClick={onRename}
          sx={{ backgroundColor: theme.palette.custom.button1.background, color: theme.palette.custom.button1.fontcolor, '&:hover': { backgroundColor: theme.palette.custom.button1.background } }}
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
              sx={{ borderColor: theme.palette.custom.button1.background, color: theme.palette.custom.button1.color, '&:hover': { borderColor: theme.palette.custom.button1.background, color: theme.palette.custom.button1.color } }}
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
