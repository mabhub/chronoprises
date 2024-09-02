import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import {
  createTheme,
  CssBaseline,
  responsiveFontSizes,
  ThemeProvider,
} from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from './store';
import App from './App';

const queryClient = new QueryClient();

const theme = responsiveFontSizes(createTheme({
  palette: {
    primary: {
      main: '#adb31b',
    },
  },
}));

const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
