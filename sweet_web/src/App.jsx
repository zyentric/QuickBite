// src/App.jsx
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppNavigator from './navigation/AppNavigator';

const premiumTheme = createTheme({
  palette: {
    primary: {
      main: '#F97316', // Vibrant orange (Mithai theme)
    },
    secondary: {
      main: '#FDE047',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
        contained: {
          boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

const App = () => (
  <ThemeProvider theme={premiumTheme}>
    <CssBaseline />
    <AppNavigator />
  </ThemeProvider>
);

export default App;