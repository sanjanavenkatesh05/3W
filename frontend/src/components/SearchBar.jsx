/**
 * SearchBar.jsx
 * --------------
 * Search input component with dark mode toggle and user avatar.
 *
 * Layout:
 * - Text input with placeholder and embedded search icon
 * - Dark mode toggle button: moon icon in light mode, sun icon in dark mode
 * - Small user avatar on the right
 *
 * Props:
 * - darkMode: boolean indicating the current theme mode
 * - onToggleDarkMode: callback to switch between light and dark themes
 */

import React from 'react';
import {
  Box,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Avatar,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

function SearchBar({ darkMode, onToggleDarkMode }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        px: 2,
        py: 1.5,
      }}
    >
      {/* -- Search Input Field --
       * Rounded outline input with a search icon button inside.
       * Background adapts to theme via 'background.paper'.
       */}
      <OutlinedInput
        placeholder="Search promotions, users..."
        size="small"
        fullWidth
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              size="small"
              sx={{
                bgcolor: 'primary.main',
                color: '#fff',
                '&:hover': { bgcolor: 'primary.dark' },
                width: 32,
                height: 32,
              }}
            >
              <SearchIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </InputAdornment>
        }
        sx={{
          borderRadius: 3,
          backgroundColor: 'background.paper',
          fontSize: '0.85rem',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'divider',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'divider',
          },
          pr: 0.5,
        }}
      />

      {/* Dark/Light mode toggle button.
       * Shows moon icon in light mode, sun icon in dark mode.
       * Calls onToggleDarkMode to switch themes.
       */}
      <IconButton
        size="small"
        onClick={onToggleDarkMode}
        sx={{
          color: 'text.secondary',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          width: 36,
          height: 36,
        }}
      >
        {darkMode ? (
          <LightModeOutlinedIcon sx={{ fontSize: 20 }} />
        ) : (
          <DarkModeOutlinedIcon sx={{ fontSize: 20 }} />
        )}
      </IconButton>

      {/* Secondary user avatar */}
      <Avatar
        sx={{
          width: 36,
          height: 36,
          fontSize: '0.75rem',
          fontWeight: 600,
          bgcolor: '#ff7043',
        }}
      >
        U
      </Avatar>
    </Box>
  );
}

export default SearchBar;
