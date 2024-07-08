// src/components/AppSelector.js
import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

function AppSelector({ selectedApp, setSelectedApp }) {
  const apps = ['Sample Blindfolder'];

  return (
    <div>
      <List component="nav">
        {apps.map(app => (
          <ListItem button selected={app === selectedApp} onClick={() => setSelectedApp(app)} key={app} >
            <ListItemText primary={app} align="center" />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default AppSelector;
