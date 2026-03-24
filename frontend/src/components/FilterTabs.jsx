/**
 * FilterTabs.jsx
 * ----------------
 * Horizontally scrollable filter chips for the post feed.
 *
 * Available filters: All Post, For You, Most Liked, Most Commented, Most Shared
 *
 * The active filter is visually highlighted with a filled chip style.
 * Inactive chips use an outlined style. The container scrolls horizontally
 * when there are too many chips to fit the viewport width.
 */

import React, { useState } from 'react';
import { Box, Chip } from '@mui/material';

/* -- Filter options --
 * Each label corresponds to a feed sorting/filtering mode.
 * This array drives the chip rendering.
 */
const FILTER_OPTIONS = [
  'All Post',
  'For You',
  'Most Liked',
  'Most Commented',
  'Most Shared',
];

function FilterTabs() {
  /* Track the currently active filter index. Defaults to "All Post" (index 0). */
  const [activeFilter, setActiveFilter] = useState(0);

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        px: 2,
        py: 1.5,
        /* Enable horizontal scrolling without showing scrollbar */
        overflowX: 'auto',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      {FILTER_OPTIONS.map((label, index) => (
        <Chip
          key={label}
          label={label}
          /* Active chip: filled primary style; Inactive: outlined */
          variant={activeFilter === index ? 'filled' : 'outlined'}
          color={activeFilter === index ? 'primary' : 'default'}
          onClick={() => setActiveFilter(index)}
          sx={{
            /* Prevent chips from shrinking when container overflows */
            flexShrink: 0,
            fontWeight: activeFilter === index ? 600 : 400,
            fontSize: '0.8rem',
            /* Active chip gets white text; inactive gets default text color */
            ...(activeFilter === index
              ? { color: '#fff' }
              : { borderColor: '#d1d5db', color: 'text.secondary' }),
            '&:hover': {
              backgroundColor:
                activeFilter === index ? 'primary.dark' : '#f3f4f6',
            },
          }}
        />
      ))}
    </Box>
  );
}

export default FilterTabs;
