/**
 * theme.js
 * --------
 * Theme factory for the Social Media application.
 * Exports a function that creates a light or dark MUI theme.
 *
 * Usage:
 *   import createAppTheme from './theme';
 *   const theme = createAppTheme('dark'); // or 'light'
 *
 * Dark mode uses a charcoal background with slightly elevated card surfaces,
 * while keeping the same blue primary and rounded component style.
 */

import { createTheme } from '@mui/material/styles';

/**
 * createAppTheme
 * Creates a Material UI theme configured for the given mode.
 *
 * @param {string} mode - 'light' or 'dark'
 * @returns {Theme} A fully configured MUI theme object
 */
function createAppTheme(mode = 'light') {
  const isLight = mode === 'light';

  return createTheme({
    /* -- Color Palette --
     * Light mode: gray canvas, white cards, dark text
     * Dark mode: charcoal canvas, elevated card surfaces, light text
     * Primary blue stays the same in both modes.
     */
    palette: {
      mode,
      primary: {
        main: '#1976d2',
        light: isLight ? '#e3f2fd' : '#1e3a5f',
        dark: '#1565c0',
      },
      secondary: {
        main: '#9e9e9e',
      },
      background: {
        default: isLight ? '#f0f2f5' : '#121212',
        paper: isLight ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: isLight ? '#1a1a2e' : '#e0e0e0',
        secondary: isLight ? '#6b7280' : '#9e9e9e',
      },
      divider: isLight ? '#e5e7eb' : '#2e2e2e',
    },

    /* -- Typography --
     * Uses Inter as the primary font with system fallbacks.
     * Font weights and sizes are calibrated for readability.
     */
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h6: {
        fontWeight: 700,
        fontSize: '1.1rem',
      },
      subtitle1: {
        fontWeight: 600,
        fontSize: '0.95rem',
      },
      subtitle2: {
        fontWeight: 400,
        fontSize: '0.8rem',
      },
      body1: {
        fontSize: '0.9rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.8rem',
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },

    /* -- Shape --
     * Rounded corners throughout for a softer, modern appearance.
     */
    shape: {
      borderRadius: 12,
    },

    /* -- Component Overrides --
     * Border colors adapt to the current mode via the divider token.
     */
    components: {
      /* Flat header with a thin bottom border */
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
          },
        },
      },
      /* Cards get a subtle border instead of heavy shadows */
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: isLight
              ? '0 1px 3px rgba(0, 0, 0, 0.06)'
              : '0 1px 3px rgba(0, 0, 0, 0.3)',
            borderRadius: 12,
          },
        },
      },
      /* Buttons have consistent rounded styling */
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '6px 16px',
          },
        },
      },
      /* Chips (used for filter tabs) are compact and clean */
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            fontWeight: 500,
          },
        },
      },
    },
  });
}

export default createAppTheme;
