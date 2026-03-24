/**
 * FloatingActionButton.jsx
 * --------------------------
 * Fixed-position floating action button (FAB) in the bottom-right corner.
 *
 * Renders a circular "+" button that sits above the bottom navigation.
 * Uses MUI's Fab component with primary color and a subtle elevation.
 * Position is fixed so it remains visible during scrolling.
 */

import React from 'react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function FloatingActionButton() {
  return (
    <Fab
      color="primary"
      aria-label="Create new post"
      sx={{
        /* Fixed position: bottom-right, above the bottom nav bar */
        position: 'fixed',
        bottom: 72,
        right: 16,
        /* Subtle shadow for depth */
        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.35)',
        '&:hover': {
          boxShadow: '0 6px 16px rgba(25, 118, 210, 0.45)',
        },
      }}
    >
      <AddIcon />
    </Fab>
  );
}

export default FloatingActionButton;
