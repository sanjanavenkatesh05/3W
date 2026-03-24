/**
 * BottomNav.jsx
 * ---------------
 * Bottom navigation bar with four navigation items.
 *
 * Items: Home, Tasks, Social (active by default), Leaderboard
 *
 * This is a fixed-position bar at the bottom of the viewport.
 * It uses MUI's BottomNavigation with custom icon styling.
 * The active item ("Social") is highlighted with the primary color.
 */

import React, { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';

function BottomNav() {
  /* Default active tab is "Social" (index 2) to match the screenshots */
  const [value, setValue] = useState(2);

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: '1px solid #e5e7eb',
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <BottomNavigation
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
        showLabels
        sx={{
          height: 56,
          backgroundColor: '#fff',
          /* Style for active navigation action */
          '& .Mui-selected': {
            color: 'primary.main',
          },
          /* Style for inactive navigation actions */
          '& .MuiBottomNavigationAction-root': {
            color: 'text.secondary',
            minWidth: 'auto',
            fontSize: '0.7rem',
          },
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeOutlinedIcon />}
        />
        <BottomNavigationAction
          label="Tasks"
          icon={<AssignmentOutlinedIcon />}
        />
        <BottomNavigationAction
          label="Social"
          icon={<PublicOutlinedIcon />}
        />
        <BottomNavigationAction
          label="Leaderboard"
          icon={<LeaderboardOutlinedIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;
