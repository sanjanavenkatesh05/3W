/**
 * ImageGrid.jsx
 * ---------------
 * Reusable component for displaying 1-4 images in a responsive grid.
 *
 * Layout adapts based on the number of images:
 * - 1 image:  Single full-width image
 * - 2 images: Two equal columns side by side
 * - 3 images: First image takes left half, two stacked on the right
 * - 4 images: 2x2 grid
 *
 * All images are rendered with rounded corners and consistent gaps.
 * Images use object-fit: cover to maintain aspect ratio while filling cells.
 */

import React from 'react';
import { Box } from '@mui/material';

function ImageGrid({ images }) {
  /* Return nothing if no images are provided */
  if (!images || images.length === 0) return null;

  const count = images.length;

  /**
   * getGridStyles
   * Returns the CSS grid template configuration based on image count.
   * Each layout is hand-tuned for visual balance.
   */
  const getGridStyles = () => {
    switch (count) {
      case 1:
        return {
          gridTemplateColumns: '1fr',
          gridTemplateRows: '240px',
        };
      case 2:
        return {
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '200px',
        };
      case 3:
        return {
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '140px 140px',
        };
      case 4:
        return {
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '140px 140px',
        };
      default:
        return {
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '140px 140px',
        };
    }
  };

  /**
   * getImageSpan
   * For 3-image layouts, the first image spans both rows on the left column.
   * All other images occupy a single cell.
   */
  const getImageSpan = (index) => {
    if (count === 3 && index === 0) {
      return { gridRow: '1 / 3' };
    }
    return {};
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gap: '4px',
        borderRadius: 2,
        overflow: 'hidden',
        mt: 1.5,
        ...getGridStyles(),
      }}
    >
      {images.slice(0, 4).map((src, index) => (
        <Box
          key={index}
          component="img"
          src={src}
          alt={`Post image ${index + 1}`}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
            '&:hover': { opacity: 0.92 },
            ...getImageSpan(index),
          }}
        />
      ))}
    </Box>
  );
}

export default ImageGrid;
