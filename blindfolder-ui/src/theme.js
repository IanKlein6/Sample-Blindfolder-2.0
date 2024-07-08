// src/theme.js
import { createTheme } from '@mui/material/styles';

const lightPalette = {
  primary: {
    main: '#00aff0', // Primary Color
  },
  secondary: {
    main: '#75ab00', // Secondary Color
  },
  background: {
    default: '#ffffff', // White Background
    paper: '#f0f4f8', // Light Blue/Grey Paper
    paperdark: '#e4eef2', // Very Light Blue/Grey Paper
  },
  text: {
    primary: '#2b5464', // Dark Text
    secondary: '#555756', // Medium Text
  },
  custom: {
    button1: {
      background: '#00aff0',
      color: '#ffffff',
    },
    button2: {
      background: '#75ab00',
      color: '#ffffff',
    },
  },
};

const darkPalette = {
  primary: {
    main: '#00aff0', // Primary Color
  },
  secondary: {
    main: '#75ab00', // Secondary Color
  },
  background: {
    default: '#2c2f33', // Dark Background
    paper: '#23272a', // Dark Paper
    paperdark: '#3a3e42', // Medium Dark Paper
  },
  text: {
    primary: '#ffffff', // Light Text
    secondary: '#b9bbbe', // Medium Light Text
  },
  custom: {
    button1: {
      background: '#00aff0',
      color: '#ffffff',
    },
    button2: {
      background: '#75ab00',
      color: '#ffffff',
    },
  },
};


const lightTheme = createTheme({
  palette: {
    mode: 'light',
    ...lightPalette,
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    ...darkPalette,
  },
});

export { lightTheme, darkTheme };
