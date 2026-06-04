import React from 'react';
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#F97316',
    secondary: '#FDE047',
    background: '#FAFAFA',
  },
};

const App = () => (
  <PaperProvider theme={theme}>
    <AppNavigator />
  </PaperProvider>
);

export default App;
