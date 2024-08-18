import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, useTheme, Typography, Box} from '@mui/material';
import IconDark from '../assets/Blindfolder_icon.png';  
import IconLight from '../assets/Blindfolder_icon_w.png';

function AppSelector({ selectedApp, setSelectedApp, settings = {} }) {
  const theme = useTheme();

  const apps = [
    {
      name: 'Blindfolder',
      icon: (
        <img 
          src={settings.darkMode ? IconLight : IconDark} 
          alt="Blindfolder Icon" 
          style={{ width: 18.21, height: 24 }} 
        /> 
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <List component="nav">
        {apps.map(app => (
          <ListItem 
            button 
            selected={selectedApp === app.imagePath} 
            onClick={() => setSelectedApp(app.name)} 
            key={app.name}
            sx={{
              border: selectedApp === app.name 
              ? `1px solid ${theme.palette.primary.main}` 
              : `1px solid transparent`, 
              borderRadius: '4px', 
            }}
          >
            <ListItemIcon>
              {app.icon}
            </ListItemIcon>
            <ListItemText primary={app.name} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt:'auto', paddings: 2, textAlign: 'center', AlignbackgroundColor: theme.palette.background.paper }}>
        <Typography variant="body2" color="textSeconday">
        © 2024 Blindfolder, All Rights Reserved by Ian Klein and Jost Wiggering.
        </Typography>
      </Box>
    </Box>    
  );
}

export default AppSelector;

