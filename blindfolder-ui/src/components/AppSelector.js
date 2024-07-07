// src/components/AppSelector.js
import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

function AppSelector({ selectedApp, setSelectedApp }) {
  const apps = ['Sample Blindfolder'];

  return (
    <List component="nav">
      {apps.map(app => (
        <ListItem button selected={app === selectedApp} onClick={() => setSelectedApp(app)} key={app}>
          <ListItemText primary={app} />
        </ListItem>
      ))}
    </List>
  );
}

export default AppSelector;
