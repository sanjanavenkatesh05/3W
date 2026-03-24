/**
 * SearchBar.jsx
 * --------------
 * Search input component with complementary action icons.
 *
 * Layout:
 * - Text input with placeholder and embedded search icon
 * - Dark mode toggle button (visual only, functionality TBD)
 * - Small user avatar on the right
 *
 * The search field uses MUI's OutlinedInput with custom rounded styling
 * to maintain the minimalistic design language.
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

function SearchBar() {
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
       * Flex-grows to fill available horizontal space.
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
          backgroundColor: '#fff',
          fontSize: '0.85rem',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e5e7eb',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d1d5db',
          },
          pr: 0.5,
        }}
      />

      {/* Dark mode toggle (placeholder functionality) */}
      <IconButton
        size="small"
        sx={{
          color: 'text.secondary',
          border: '1px solid #e5e7eb',
          borderRadius: 2,
          width: 36,
          height: 36,
        }}
      >
        <DarkModeOutlinedIcon sx={{ fontSize: 20 }} />
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
