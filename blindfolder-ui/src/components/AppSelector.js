import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, useTheme, Typography, Box } from '@mui/material';
import IconDark from '../assets/Test_logo.png';  // switch back to original icon dark
import IconLight from '../assets/Test_logo.png'; // switch back to original icon light

function AppSelector({ selectedApp, setSelectedApp, settings = {} }) {
  const theme = useTheme(); 
  const apps = [
    {
      name: 'BlindFolder', // App name
      icon: (
        <img 
          src={settings.darkMode ? IconLight : IconDark}  // Switch icon based on dark mode
          alt="Blindfolder Icon" 
          style={{ width: 18.21, height: 24 }}  // Set icon size
        /> 
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* App selection list */}
      <List component="nav">
        {apps.map(app => (
          <ListItem 
            button
            selected={selectedApp === app.name}  // Highlight selected app
            onClick={() => setSelectedApp(app.name)}  // Set the selected app
            key={app.name}
            sx={{
              backgroundColor: theme.palette.primary.main,  // Default background color for unselected items
              borderRadius: '3px',  
              transition: 'background-color 0.3s, border 0.3s',  
              '&:hover': {
                backgroundColor: theme.palette.custom.button2.background,  
              },
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.light,  
                border: `2px solid ${theme.palette.custom.button2.background}`, 
              },  
            }}
          >
            <ListItemIcon>
              {app.icon}  {/* Display the app icon */}
            </ListItemIcon>
            <ListItemText primary={app.name} />  {/* Display the app name */}
          </ListItem>
        ))}
      </List>

      {/* Footer section */}
      <Box sx={{ mt: 'auto', padding: 2, borderRadius: '3px', textAlign: 'center', backgroundColor: theme.palette.background.paper }}>
        <Typography variant="body2" color="textSecondary">
          © 2024 BlindFolder 2.0, All Rights Reserved by 
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Ian Klein and Jost Wiggering.
        </Typography>
      </Box>
    </Box>    
  );
}

export default AppSelector;
