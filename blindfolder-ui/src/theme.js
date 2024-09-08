import { createTheme } from '@mui/material/styles';

// Light Mode Color Palette
const lightMode = {
  primary: {
    main: '#00aff0', // Primary color (used for buttons, highlights)
  },
  secondary: {
    main: '#0078d7', // Secondary color (used for accents)
  },
  background: {
    default: '#ffffff', // Default background color
    paper: '#f0f0f0',   // Paper background color
    paperdark: '#e4eef2', // Darker paper color for contrast
    paperlight: '#ffffff', // Light paper color for UI components
  },
  text: {
    primary: '#1c1c1c', // Main text color
    secondary: '#595959', // Secondary text color (used for subtitles, hints)
  },
  // Custom button styles for the light theme
  custom: {
    button2: {
      background: '#0078d7',
      color: '#23272a',
    },
    button1: {
      background: '#00aff0',
      color: '#23272a',
    },
  },
};

// Dark Mode Color Palette
const darkMode = {
  primary: {
    main: '#7289da', // Primary color for dark mode
  },
  secondary: {
    main: '#99aab5', // Secondary color for dark mode
  },
  background: {
    default: '#2c2f33', // Default background color in dark mode
    paper: '#23272a',   // Paper background for UI elements
    paperdark: '#2b5464', // Darker paper color for contrast in dark mode
    paperlight: '#2c2f33', // Light paper color for specific elements
  },
  text: {
    primary: '#ffffff', // Main text color in dark mode (white)
    secondary: '#b9bbbe', // Secondary text color (grayish)
  },
  // Custom button styles for the dark theme
  custom: {
    button1: {
      background: '#7289da',
      color: '#ffffff', // White text on buttons
    },
    button2: {
      background: '#2b5464',
      color: '#ffffff', // White text on buttons
    },
  },
};

// Create light theme using MUI's createTheme function
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    ...lightMode,  
  },
});

// Create dark theme using MUI's createTheme function
const darkTheme = createTheme({
  palette: {
    mode: 'dark', 
    ...darkMode,   
  },
});

export { lightTheme, darkTheme };
