/**
 * main.jsx
 * ----------
 * Application entry point.
 *
 * Sets up:
 * - React strict mode for development warnings
 * - Global CSS from index.css
 *
 * Note: ThemeProvider and CssBaseline are managed in App.jsx
 * so that dark mode state changes can trigger theme re-renders.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
