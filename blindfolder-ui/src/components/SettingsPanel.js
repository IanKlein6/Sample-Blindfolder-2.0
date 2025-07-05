import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  TextField,
  Box,
  Button,
  Grid,
  useTheme,
  Typography
} from '@mui/material';

function SettingsPanel({ settings, setSettings, onShowInstructions }) {
  const theme = useTheme();

  // Get app version
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    if (window?.electronAPI?.getAppVersion) {
      window.electronAPI.getAppVersion().then(setAppVersion);
    }
  }, []);

  // Handle input changes (both text and checkbox)
  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: 'background.paper', borderRadius: 2 }}>
      {/* Title */}
      <Typography variant="h6" gutterBottom align="center">
        Settings
      </Typography>

      {/* Naming Prefix */}
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

      {/* Toggle Settings */}
      <Grid container spacing={2}>
        {/* Auto Open Folder */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.autoOpen}
                onChange={handleChange}
                name="autoOpen"
              />
            }
            label={
              <Typography sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                Auto Open Folder
              </Typography>
            }
            sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}
          />
        </Grid>

        {/* Dark Mode */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.darkMode}
                onChange={handleChange}
                name="darkMode"
              />
            }
            label={
              <Typography sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                Dark Mode
              </Typography>
            }
            sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}
          />
        </Grid>

        {/* Check for Updates Toggle */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.checkForUpdates}
                onChange={handleChange}
                name="checkForUpdates"
              />
            }
            label={
              <Typography sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                Automatically Check for Updates
              </Typography>
            }
            sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}
          />
        </Grid>

        {/* Show Instructions */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.showInstructions}
                onChange={handleChange}
                name="showInstructions"
              />
            }
            label={
              <Typography sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                Show Instructions on Startup
              </Typography>
            }
            sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}
          />
        </Grid>

        {/* Manual Check for Updates Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={() => window.dispatchEvent(new CustomEvent('manual-check-update'))}
            sx={{
              color: theme.palette.custom.button1.color,
              borderColor: theme.palette.custom.button1.background,
              '&:hover': {
                backgroundColor: theme.palette.custom.button2.background,
                color: theme.palette.custom.button2.color
              },
              marginBottom: 2
            }}
          >
            Manually Check for Updates
          </Button>
        </Grid>

        {/* Show Instructions Button */}
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

      {/* App Version */}
      <Typography
        variant="caption"
        color="textSecondary"
        align="center"
        sx={{ display: 'block', mt: 2 }}
      >
        BlindFolder version {appVersion}
      </Typography>
    </Box>
  );
}

export default SettingsPanel;
