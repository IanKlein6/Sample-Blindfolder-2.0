import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel, TextField, Box, Button, Grid, useTheme, Typography } from '@mui/material';
import { useTranslation } from '../TranslationContext';

function SettingsPanel({ settings, setSettings, onShowInstructions }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: 'background.paper', borderRadius: 1 }}>
      <Typography variant="h6" gutterBottom align="center">
        {t('settings')}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch checked={settings.autoOpen} onChange={handleChange} name="autoOpen" />}
            label={<Typography sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{t('autoOpen')}</Typography>}
            sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch checked={settings.autoName} onChange={handleChange} name="autoName" />}
            label={<Typography sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{t('autoName')}</Typography>}
            sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}
          />
        </Grid>
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
        <Grid item xs={12}>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="file-format-label">{t('fileFormat')}</InputLabel>
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
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch checked={settings.darkMode} onChange={handleChange} name="darkMode" />}
            label={<Typography sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{t('darkMode')}</Typography>}
            sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch checked={settings.showInstructions} onChange={handleChange} name="showInstructions" />}
            label={<Typography sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{t('showInstructions')}</Typography>}
            sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={onShowInstructions}
            sx={{ backgroundColor: theme.palette.custom.button1.background, color: theme.palette.custom.button1.color, '&:hover': { backgroundColor: theme.palette.custom.button1.background } }}
          >
            {t('showInstructionsButton')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SettingsPanel;
