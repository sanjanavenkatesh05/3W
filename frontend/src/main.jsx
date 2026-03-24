/**
 * main.jsx
 * ----------
 * Application entry point.
 *
 * Sets up:
 * - React strict mode for development warnings
 * - MUI ThemeProvider with the custom minimalistic theme
 * - CssBaseline for consistent cross-browser baseline styles
 * - Global CSS from index.css
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ThemeProvider makes the custom theme available to all MUI components */}
    <ThemeProvider theme={theme}>
      {/* CssBaseline normalizes browser defaults and applies theme background */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
