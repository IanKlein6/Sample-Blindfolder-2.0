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
    paper: '#f0f0f0',
    paperdark: '#e4eef2',
    paperlight: '#ffffff',
  },
  text: {
    primary: '#1c1c1c',
    secondary: '#595959',
  },
  custom: {
    button1: {
      background: '#0078d7',
      color: '#ffffff',
    },
    button2: {
      background: '#00aff0',
      color: '#ffffff',
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
    paperdark: '#2b5464',
    paperlight: '#2c2f33',
  },
  text: {
    primary: '#ffffff',
    secondary: '#b9bbbe',
  },
  custom: {
    button1: {
      background: '#7289da',
      color: '#ffffff',
    },
    button2: {
      background: '#99aab5',
      color: '#23272a',
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
