// src/components/SettingsPanel.js
import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';

function SettingsPanel({ settings, setSettings }) {
  const handleToggle = (name) => {
    setSettings({ ...settings, [name]: !settings[name] });
  };

  return (
    <div>
      <h2>Settings</h2>
      <FormControlLabel
        control={<Switch checked={settings.autoOpen} onChange={() => handleToggle('autoOpen')} />}
        label="Automatic File Opening"
      />
      <FormControlLabel
        control={<Switch checked={settings.autoName} onChange={() => handleToggle('autoName')} />}
        label="Automatic Naming Schemes"
      />
    </div>
  );
}

export default SettingsPanel;
