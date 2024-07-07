// src/components/MainAppView.js
import React from 'react';
import { Box, Button, Typography } from '@mui/material';

function MainAppView({ selectedApp, folders, onAddFolder, onRename, onRemoveFolder }) {
  return (
    <Box sx={{ padding: 5, backgroundColor: 'background.paperlight', height: '100%' }}>
      <Typography variant="h4" gutterBottom>
        {selectedApp}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <Button variant="contained" onClick={onAddFolder}>
          Add Folder
        </Button>
        <Button variant="contained" onClick={onRename}>
          Rename
        </Button>
      </Box>
      <Box sx={{ marginTop:2 }}>
        {folders.map((folder, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              {folder}
            </Typography>
            <Button variant="outlined" color="secondary" onClick={() => onRemoveFolder(index)}>
              Remove
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default MainAppView;
