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

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Badge,
  Chip,
  Menu,
  MenuItem,
} from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

function TopBar({ user, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuLogout = () => {
    handleMenuClose();
    if (onLogout) onLogout();
  };

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
          <IconButton onClick={handleMenuClick} size="small" sx={{ p: 0, ml: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: '0.8rem',
                fontWeight: 600,
                bgcolor: '#1976d2',
              }}
            >
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </Avatar>
          </IconButton>

          {/* User Actions Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: { minWidth: 160, mt: 1.5, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }
            }}
          >
            <MenuItem disabled sx={{ opacity: '1 !important', pb: 1.5, borderBottom: '1px solid #f0f0f0' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                @{user?.username || 'Guest'}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleMenuLogout} sx={{ color: 'error.main', mt: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Log out</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
