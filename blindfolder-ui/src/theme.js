import { createTheme } from '@mui/material/styles';

const lightMode = {
  primary: {
    main: '#00aff0',
  },
  secondary: {
    main: '#0078d7',
  },
  background: {
    default: '#ffffff',
    paper: '#f0f0f0',
    paperdark: '#e4eef2',
    paperlight: '#ffffff',
  },
  text: {
    primary: '#1c1c1c',
    secondary: '#595959',
  },
  // Custom Button
  custom: {
    button1: {
      background: '#0078d7',
      color: '#23272a',
    },
    button2: {
      background: '#00aff0',
      color: '#23272a',
    },
  },
};

const darkMode = {
  primary: {
    main: '#7289da',
  },
  secondary: {
    main: '#99aab5',
  },
  background: {
    default: '#2c2f33',
    paper: '#23272a',
    paperdark: '#2b5464',
    paperlight: '#2c2f33',
  },
  text: {
    primary: '#ffffff',
    secondary: '#b9bbbe',
  },
  // Custom Button
  custom: {
    button1: {
      background: '#7289da',
      color: '#ffffff',
    },
    button2: {
      background: '#2b5464',
      color: '#ffffff',
    },
  },
};

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    ...lightMode,
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    ...darkMode,
  },
});

export { lightTheme, darkTheme };
