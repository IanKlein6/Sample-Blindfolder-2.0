// src/components/SettingsPanel.js
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, TextField, Box, useTheme, Button } from '@mui/material';

function SettingsPanel({ settings, setSettings }) {
  const theme = useTheme();

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
      <h2>Settings</h2>
      <FormControlLabel
        control={<Switch checked={settings.autoOpen} onChange={handleChange} name="autoOpen" />}
        label="Automatic File Opening"
        sx={{ marginBottom: 2 }}
      />
      <FormControlLabel
        control={<Switch checked={settings.autoName} onChange={handleChange} name="autoName" />}
        label="Automatic Naming Schemes"
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Naming Prefix"
        value={settings.namingPrefix}
        name="namingPrefix"
        onChange={handleChange}
        fullWidth
        margin="normal"
        sx={{ marginBottom: 2 }}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>File Format</InputLabel>
        <Select value={settings.fileFormat} name="fileFormat" onChange={handleChange}>
          <MenuItem value="xlsx">Excel (XLSX)</MenuItem>
          <MenuItem value="csv">CSV</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel
        control={<Switch checked={settings.darkMode} onChange={handleChange} name="darkMode" />}
        label="Dark Mode"
        sx={{ marginTop: 2 }}
      />
      <Button
        variant="contained"
        sx={{ backgroundColor: theme.palette.secondary.main, color: theme.palette.secondary.contrastText, '&:hover': { backgroundColor: theme.palette.secondary.dark } }}
      >
        Apply Settings
      </Button>
    </Box>
  );
}

export default SettingsPanel;
