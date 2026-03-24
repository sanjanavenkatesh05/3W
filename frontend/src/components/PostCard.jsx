/**
 * PostCard.jsx
 * ---------------
 * Individual post card component displaying user info, content, images,
 * and engagement actions.
 *
 * Sections (top to bottom):
 * 1. Header: Avatar, display name, username, timestamp, Follow button
 * 2. Body: Post text content with hashtags highlighted in blue
 * 3. Images: 1-4 images rendered via the ImageGrid component
 * 4. Actions: Like, Comment, Share buttons with counts
 *
 * Props:
 * - post: Object containing all post data (see samplePosts.js for shape)
 */

import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import ImageGrid from './ImageGrid';

/**
 * renderContentWithHashtags
 * Parses the post content string and renders hashtags as styled spans.
 * Regular text is rendered as-is; words starting with "#" get blue styling.
 */
function renderContentWithHashtags(content, hashtags) {
  /* Combine the main content and hashtags into a single display string */
  const fullText = hashtags.length > 0
    ? `${content}\n${hashtags.join(' ')}`
    : content;

  /* Split by whitespace, style hashtag words differently */
  return fullText.split(/(\s+)/).map((word, i) => {
    if (word.startsWith('#')) {
      return (
        <Typography
          key={i}
          component="span"
          sx={{
            color: 'primary.main',
            fontWeight: 500,
            fontSize: '0.85rem',
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          {word}
        </Typography>
      );
    }
    return <span key={i}>{word}</span>;
  });
}

function PostCard({ post }) {
  return (
    <Card sx={{ mx: 2, mb: 1.5 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* ---- Header Section ---- */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 1.5,
          }}
        >
          {/* User avatar with colored background fallback */}
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: post.avatarColor || '#1976d2',
              fontSize: '0.9rem',
              fontWeight: 600,
              mr: 1.5,
            }}
          >
            {/* Display first letter of the display name */}
            {post.displayName.charAt(0)}
          </Avatar>

          {/* Name, username, and timestamp stacked vertically */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  lineHeight: 1.3,
                }}
              >
                {post.displayName}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ fontSize: '0.75rem', color: 'text.secondary' }}
              >
                {post.username}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
            >
              {post.timestamp}
            </Typography>
          </Box>

          {/* Follow button */}
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 5,
              textTransform: 'none',
              fontSize: '0.75rem',
              fontWeight: 600,
              px: 2,
              py: 0.3,
              minWidth: 'auto',
              borderColor: 'primary.main',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.light',
                borderColor: 'primary.main',
              },
            }}
          >
            Follow
          </Button>
        </Box>

        {/* ---- Content Section ---- */}
        <Typography
          variant="body1"
          sx={{
            color: 'text.primary',
            lineHeight: 1.7,
            whiteSpace: 'pre-line',
            fontSize: '0.85rem',
          }}
        >
          {renderContentWithHashtags(post.content, post.hashtags)}
        </Typography>

        {/* ---- Image Grid Section ----
         * Renders 0-4 images using the ImageGrid component.
         * Only renders if the post has images attached.
         */}
        {post.images && post.images.length > 0 && (
          <ImageGrid images={post.images} />
        )}

        {/* ---- Action Bar Section ---- */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
            pt: 1.5,
            borderTop: '1px solid #f0f0f0',
          }}
        >
          {/* Like action */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <FavoriteBorderIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {post.likes}
            </Typography>
          </Box>

          {/* Comment action */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {post.comments}
            </Typography>
          </Box>

          {/* Share action */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <ShareOutlinedIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {post.shares}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default PostCard;
