/**
 * theme.js
 * --------
 * Custom Material UI theme for the Social Media application.
 * Defines the color palette, typography, shape, and component overrides
 * to create a clean, minimalistic design system.
 */

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  /* -- Color Palette --
   * Primary: Material blue for interactive elements (buttons, links, active states)
   * Background: Light gray canvas with white card surfaces
   * Text: Dark gray primary, medium gray secondary for hierarchy
   */
  palette: {
    primary: {
      main: '#1976d2',
      light: '#e3f2fd',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9e9e9e',
    },
    background: {
      default: '#f0f2f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#6b7280',
    },
    divider: '#e5e7eb',
  },

  /* -- Typography --
   * Uses Inter as the primary font with system fallbacks.
   * Font weights and sizes are calibrated for readability and hierarchy.
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
      color: '#6b7280',
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
   * Customize default MUI component styles to match the minimal design.
   */
  components: {
    /* Remove default AppBar elevation for a flat header */
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #e5e7eb',
        },
      },
    },
    /* Cards get a subtle border instead of heavy shadows */
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb',
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

export default theme;
