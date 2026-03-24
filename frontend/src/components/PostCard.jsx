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

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Avatar,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import SendIcon from '@mui/icons-material/Send';
import ImageGrid from './ImageGrid';
import api from '../services/api';

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

function PostCard({ post, currentUser }) {
  /* -- State for Engagement --
   * Initialize with props, then update locally for immediate feedback (optimistic UI)
   */
  const [likes, setLikes] = useState(post.likes || 0);
  
  // Track if current user liked it based on DB data or current session action
  const initialIsLiked = post.liked_by?.includes(currentUser?.id) || false;
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLiking, setIsLiking] = useState(false);
  
  const [commentsCount, setCommentsCount] = useState(post.comments || 0);
  const [commentsList, setCommentsList] = useState(post.commentsList || []);
  const [shares, setShares] = useState(post.shares || 0);

  /* -- State for Comment Input -- */
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * handleLike
   * Optimistically toggles the like count and calls the backend.
   */
  const handleLike = async () => {
    if (isLiking) return; // Prevent spamming clicks while network request is pending

    const wasLiked = isLiked;
    setIsLiking(true);

    // Optimistic UI update
    setLikes((prev) => (wasLiked ? prev - 1 : prev + 1));
    setIsLiked(!wasLiked);

    try {
      /* id might be id or _id depending on sample vs real data */
      const postId = post._id || post.id;
      if (typeof postId === 'string') {
        // The same endpoint toggles the status on the backend
        await api.likePost(postId);
      }
    } catch (error) {
      console.error('Failed to toggle like on post:', error);
      // Revert optimism on failure
      setLikes((prev) => (wasLiked ? prev + 1 : prev - 1));
      setIsLiked(wasLiked);
    } finally {
      setIsLiking(false);
    }
  };

  /**
   * handleShare
   * Optimistically increments the share count and calls the backend.
   */
  const handleShare = async () => {
    setShares((prev) => prev + 1);

    try {
      const postId = post._id || post.id;
      if (typeof postId === 'string') {
        await api.sharePost(postId);
      }
    } catch (error) {
      console.error('Failed to share post:', error);
      setShares((prev) => prev - 1);
    }
  };

  /**
   * handleAddComment
   * Submits a new comment to the backend and updates the count.
   */
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    const previousCount = commentsCount;
    const previousList = [...commentsList];
    
    // Optimistic update
    setCommentsCount((prev) => prev + 1);
    setCommentsList((prev) => [...prev, {
      _id: 'temp_' + Date.now(),
      username: '@current_user',
      text: commentText.trim(),
      created_at: new Date().toISOString()
    }]);
    setCommentText('');

    try {
      const postId = post._id || post.id;
      if (typeof postId === 'string') {
        const updatedPost = await api.addComment(postId, {
          text: commentText.trim(),
          username: '@current_user' // Hardcoded for now without auth
        });
        
        // The backend returns the raw mongoose document for this route
        if (updatedPost && updatedPost.comments) {
          setCommentsList(updatedPost.comments);
          setCommentsCount(updatedPost.comments.length);
        }
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      setCommentsCount(previousCount); // Revert on failure
      setCommentsList(previousList);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <IconButton 
              size="small" 
              onClick={handleLike} 
              disabled={isLiking}
              sx={{ color: isLiked ? 'error.main' : 'text.secondary' }}
            >
              {isLiked ? <FavoriteIcon sx={{ fontSize: 20 }} /> : <FavoriteBorderIcon sx={{ fontSize: 20 }} />}
            </IconButton>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {likes}
            </Typography>
          </Box>

          {/* Comment action */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small" onClick={() => setShowCommentBox(!showCommentBox)} sx={{ color: showCommentBox ? 'primary.main' : 'text.secondary' }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {commentsCount}
            </Typography>
          </Box>

          {/* Share action */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small" onClick={handleShare} sx={{ color: 'text.secondary' }}>
              <ShareOutlinedIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {shares}
            </Typography>
          </Box>
        </Box>

        {/* ---- Comment Input Box (Toggleable) ---- */}
        {showCommentBox && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                size="small"
                fullWidth
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isSubmitting}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleAddComment();
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    fontSize: '0.85rem',
                  }
                }}
              />
              <IconButton 
                color="primary" 
                onClick={handleAddComment}
                disabled={!commentText.trim() || isSubmitting}
                sx={{ bgcolor: 'primary.light', borderRadius: 2, '&:hover': { bgcolor: 'primary.main', color: '#fff' } }}
              >
                <SendIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>

            {/* ---- Comments List ---- */}
            {commentsList.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {/* Shallow copy before reverse to avoid mutating state array */}
                {[...commentsList].reverse().map((c) => (
                  <Box key={c._id} sx={{ display: 'flex', gap: 1 }}>
                    <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem', bgcolor: 'secondary.main' }}>
                      {c.username ? c.username.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                    <Box sx={{ bgcolor: 'background.default', p: 1.5, borderRadius: 2, flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.8rem', mb: 0.5 }}>
                        {c.username}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'text.primary' }}>
                        {c.text}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default PostCard;
