// src/components/SettingsPanel.js
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, TextField } from '@mui/material';

function SettingsPanel({ settings, setSettings }) {
  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div>
      <h2>Settings</h2>
      <FormControlLabel
        control={<Switch checked={settings.autoOpen} onChange={handleChange} name="autoOpen" />}
        label="Automatic File Opening"
      />
      <FormControlLabel
        control={<Switch checked={settings.autoName} onChange={handleChange} name="autoName" />}
        label="Automatic Naming Schemes"
      />
      <TextField
        label="Naming Prefix"
        value={settings.namingPrefix}
        name="namingPrefix"
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>File Format</InputLabel>
        <Select value={settings.fileFormat} name="fileFormat" onChange={handleChange}>
          <MenuItem value="xlsx">Excel (XLSX)</MenuItem>
          <MenuItem value="csv">CSV</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

export default SettingsPanel;
