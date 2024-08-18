import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import BlindfolderIcon from '../assets/Blindfolder_icon.png';  


function AppSelector({ selectedApp, setSelectedApp }) {
  const apps = [
    {
      name: 'Blindfolder',
      icon: <img src={BlindfolderIcon} alt="Blindfolder Icon" style={{ width: 18.21, height: 24 }} />,
    },
  ];

  return (
    <List component="nav">
      {apps.map(app => (
        <ListItem 
          button 
          selected={selectedApp === app.imagePath} 
          onClick={() => setSelectedApp(app.name)} 
          key={app.name}
          sx={{
            border: selectedApp === app.name ? '1px solid #1976d2' : '1px solid transparent', // Blue border for selected, transparent otherwise
            borderRadius: '4px', // Optional: rounded corners
          }}
        >
          <ListItemIcon>
            {app.icon}
          </ListItemIcon>
          <ListItemText primary={app.name} />
        </ListItem>
      ))}
    </List>
  );
}

export default AppSelector;

