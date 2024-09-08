import React from 'react';
import { 
  FormControl, InputLabel, Select, MenuItem, Switch, 
  FormControlLabel, TextField, Box, Button, Grid, 
  useTheme, Typography 
} from '@mui/material';

function SettingsPanel({ settings, setSettings, onShowInstructions }) {
  // Access the theme object using MUI's useTheme hook
  const theme = useTheme();

  // Handle form changes for all input fields
  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value, // Handle checkbox and regular inputs
    });
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: 'background.paper', borderRadius: 2 }}>
      {/* Settings title */}
      <Typography variant="h6" gutterBottom align="center">
        Settings
      </Typography>
      
      {/* Naming Prefix Input */}
      <Grid item xs={12}>
        <TextField
          label="Naming Prefix"
          value={settings.namingPrefix}
          name="namingPrefix"
          onChange={handleChange}
          fullWidth
          margin="normal"
          sx={{ marginBottom: 2 }}
        />
      </Grid>

      {/* File Format Dropdown */}
      <Grid item xs={12}>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="file-format-label">File Format</InputLabel>
          <Select
            labelId="file-format-label"
            value={settings.fileFormat}
            name="fileFormat"
            onChange={handleChange}
            label="File Format"
          >
            <MenuItem value="xlsx">Excel (XLSX)</MenuItem>
            <MenuItem value="csv">CSV</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Switches for various settings */}
      <Grid container spacing={2}>
        {/* Auto Open Folder Switch */}
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch checked={settings.autoOpen} onChange={handleChange} name="autoOpen" />}
            label={
              <Typography sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                Auto Open Folder
              </Typography>
            }
            sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}
          />
        </Grid>

        {/* Dark Mode Switch */}
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch checked={settings.darkMode} onChange={handleChange} name="darkMode" />}
            label={
              <Typography sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                Dark Mode
              </Typography>
            }
            sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}
          />
        </Grid>

        {/* Show Instructions on Startup Switch */}
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch checked={settings.showInstructions} onChange={handleChange} name="showInstructions" />}
            label={
              <Typography sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                Show Instructions on Startup
              </Typography>
            }
            sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}
          />
        </Grid>

        {/* Button to Manually Show Instructions */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={onShowInstructions}
            sx={{ 
              backgroundColor: theme.palette.custom.button1.background, 
              color: theme.palette.custom.button1.color, 
              '&:hover': { backgroundColor: theme.palette.custom.button2.background } 
            }}
          >
            Show Instructions
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SettingsPanel;
