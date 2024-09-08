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
            selected={selectedApp === app.name} 
            onClick={() => setSelectedApp(app.name)} 
            key={app.name}
            sx={{
              backgroundColor: theme.palette.primary.main,  // Default background color
              borderRadius: '3px',  // Rounded corners
              transition: 'background-color 0.3s, border 0.3s',  // Smooth transition for hover/selection
              '&:hover': {
                backgroundColor: theme.palette.custom.button2.background,  // Brighter on hover
              },
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.light,  // Brighter on selection
                border: `2px solid ${theme.palette.custom.button2.background}`,  // Add border when selected
           
              },  
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
        © 2024 Blindfolder 2.0, All Rights Reserved by 
        </Typography>
        <Typography variant="body2" color="textSeconday">
        Ian Klein and Jost Wiggering.
        </Typography>
      </Box>
    </Box>    
  );
}

export default AppSelector;

