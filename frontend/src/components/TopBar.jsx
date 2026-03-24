/**
 * TopBar.jsx
 * -----------
 * Top application bar component for the Social Media app.
 *
 * Layout:
 * - Left side: App title "Social"
 * - Right side: Points badge (gold star + number), balance display,
 *   notification bell with badge, and user avatar
 *
 * This is a fixed-position bar that stays at the top of the viewport.
 */

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Badge,
  Chip,
} from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

function TopBar() {
  return (
    <AppBar
      position="fixed"
      color="inherit"
      /* Flat white header with a thin bottom border (set by theme overrides) */
      sx={{
        backgroundColor: 'background.paper',
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          minHeight: 56,
          px: 2,
        }}
      >
        {/* -- App Title -- */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            letterSpacing: '-0.02em',
          }}
        >
          Social
        </Typography>

        {/* -- Right Section: Points, Balance, Notifications, Avatar -- */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Points badge: gold star with a count */}
          <Chip
            icon={<StarRoundedIcon sx={{ color: '#f9a825', fontSize: 18 }} />}
            label="50"
            size="small"
            sx={{
              backgroundColor: '#fff8e1',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 28,
              '& .MuiChip-icon': { ml: 0.5 },
            }}
          />

          {/* Balance display */}
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              color: 'text.secondary',
              fontSize: '0.8rem',
            }}
          >
            &#8377;0.00
          </Typography>

          {/* Notification bell with badge indicator */}
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <Badge
              variant="dot"
              color="error"
              /* Overlap ensures the dot sits on the icon edge */
              overlap="circular"
            >
              <NotificationsNoneOutlinedIcon sx={{ fontSize: 22 }} />
            </Badge>
          </IconButton>

          {/* User avatar: initials with a colored background */}
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: '0.8rem',
              fontWeight: 600,
              bgcolor: '#1976d2',
            }}
          >
            U
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
