// src/theme.js
import { createTheme } from '@mui/material/styles';

const skypePalette = {
  primary: {
    main: '#00aff0',
  },
  secondary: {
    main: '#0078d7',
  },
  background: {
    default: '#ffffff',
    paper: '#e4eef2',
    paperlight: '#f9f9f9',
  },
  text: {
    primary: '#1c1c1c',
    secondary: '#595959',
  },
  custom: {
    button1: {
      background: '#e4eef2',
      fontcolor: '#000000',
    },
    button2: {
      background: '#f9f9f9',
      fontcolor: '#ffffff',
    },
  },
};

const discordPalette = {
  primary: {
    main: '#7289da',
  },
  secondary: {
    main: '#99aab5',
  },
  background: {
    default: '#2c2f33',
    paper: '#23272a',
    paperlight: '#595f66',
  },
  text: {
    primary: '#ffffff',
    secondary: '#b9bbbe',
  },
  custom: {
    button1: {
      background: '#7289da',
      fontcolor: '#ffffff',
    },
    button2: {
      background: '#99aab5',
      fontcolor: '#23272a',
    },
  },
};

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    ...skypePalette,
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    ...discordPalette,
  },
});

export { lightTheme, darkTheme };
