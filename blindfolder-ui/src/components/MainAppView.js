// src/components/MainAppView.js
import React from 'react';
import { Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function MainAppView({ selectedApp, folders, onAddFolder, onRename, onRemoveFolder }) {
  return (
    <div>
      <h1>{selectedApp}</h1>
      <Button variant="contained" color="primary" onClick={onAddFolder}>
        Add Folder
      </Button>
      <List>
        {folders.map((folder, index) => (
          <ListItem key={index} secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => onRemoveFolder(index)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemText primary={folder} />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="secondary" onClick={onRename}>
        Destination - Blindfold
      </Button>
    </div>
  );
}

export default MainAppView;
