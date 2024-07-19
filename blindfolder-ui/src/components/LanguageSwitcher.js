import React from 'react';
import { Select, MenuItem } from '@mui/material';
import { useTranslation } from '../TranslationContext';

function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();

  return (
    <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
      <MenuItem value="en">English</MenuItem>
      <MenuItem value="de">Deutsch</MenuItem>
    </Select>
  );
}

export default LanguageSwitcher;
