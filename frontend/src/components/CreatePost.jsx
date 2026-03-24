/**
 * CreatePost.jsx
 * ----------------
 * Post creation component with text input and image upload support.
 *
 * Features:
 * - Toggle between "All Posts" and "Promotions" mode
 * - Multiline text area for post content
 * - Image upload via camera button (up to 4 images)
 * - Image preview thumbnails with remove capability
 * - Validation: prevents uploading more than 4 images
 * - Post submission: calls onCreatePost callback with text and images
 *
 * Props:
 * - onCreatePost(postData): Callback fired when user submits a post.
 *   postData contains { content, images } where images is an array of
 *   data URLs (base64 encoded from file reader).
 */

import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
} from '@mui/material';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

/* Maximum number of images allowed per post */
const MAX_IMAGES = 4;

function CreatePost({ onCreatePost }) {
  /* -- State --
   * postMode: "all" or "promotions" toggle
   * content: text content of the post
   * images: array of { file, preview } objects for attached images
   * warning: error message when user exceeds image limit
   */
  const [postMode, setPostMode] = useState('all');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [warning, setWarning] = useState('');

  /* Hidden file input ref: triggered programmatically by the camera button */
  const fileInputRef = useRef(null);

  /**
   * handleImageSelect
   * Triggered when user selects files from the file picker.
   * Validates count (total must not exceed MAX_IMAGES),
   * reads each file as a data URL, and adds to the images array.
   */
  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    setWarning('');

    /* Check if adding these files would exceed the limit */
    if (images.length + files.length > MAX_IMAGES) {
      setWarning(`You can attach up to ${MAX_IMAGES} images per post.`);
      /* Reset the file input so the user can try again */
      event.target.value = '';
      return;
    }

    /* Read each selected file and create preview data URLs */
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages((prev) => [
          ...prev,
          { file, preview: e.target.result },
        ]);
      };
      reader.readAsDataURL(file);
    });

    /* Reset file input value so re-selecting the same file works */
    event.target.value = '';
  };

  /**
   * handleRemoveImage
   * Removes an image from the preview list by its index.
   * Also clears any warning since removal frees up a slot.
   */
  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
    setWarning('');
  };

  /**
   * handlePost
   * Submits the post with current text content and image data URLs.
   * Resets the form after successful submission.
   */
  const handlePost = () => {
    /* Require at least some text content */
    if (!content.trim()) return;

    onCreatePost({
      content: content.trim(),
      images: images.map((img) => img.preview),
    });

    /* Reset form state */
    setContent('');
    setImages([]);
    setWarning('');
  };

  return (
    <Card sx={{ mx: 2, mb: 1 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* -- Header Row: Title + Mode Toggle -- */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1.5,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Create Post
          </Typography>

          {/* Toggle between All Posts and Promotions */}
          <ToggleButtonGroup
            value={postMode}
            exclusive
            onChange={(e, val) => val && setPostMode(val)}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                px: 1.5,
                py: 0.3,
                fontSize: '0.7rem',
                fontWeight: 600,
                borderRadius: '16px !important',
                border: '1px solid #e5e7eb',
                textTransform: 'none',
              },
              '& .Mui-selected': {
                backgroundColor: 'primary.main !important',
                color: '#fff !important',
              },
            }}
          >
            <ToggleButton value="all">All Posts</ToggleButton>
            <ToggleButton value="promotions">Promotions</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* -- Text Input Area -- */}
        <TextField
          placeholder="What's on your mind?"
          multiline
          minRows={2}
          maxRows={4}
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant="standard"
          InputProps={{ disableUnderline: true }}
          sx={{
            mb: 1,
            '& .MuiInputBase-input': {
              fontSize: '0.85rem',
              color: 'text.secondary',
            },
          }}
        />

        {/* -- Image Limit Warning -- */}
        {warning && (
          <Alert
            severity="warning"
            onClose={() => setWarning('')}
            sx={{ mb: 1, fontSize: '0.75rem', py: 0 }}
          >
            {warning}
          </Alert>
        )}

        {/* -- Image Previews --
         * Displays thumbnails of attached images in a horizontal row.
         * Each thumbnail has a close button to remove it.
         */}
        {images.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mb: 1.5,
              flexWrap: 'wrap',
            }}
          >
            {images.map((img, index) => (
              <Box
                key={index}
                sx={{
                  position: 'relative',
                  width: 72,
                  height: 72,
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  border: '1px solid #e5e7eb',
                }}
              >
                <Box
                  component="img"
                  src={img.preview}
                  alt={`Preview ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {/* Remove button overlay */}
                <IconButton
                  size="small"
                  onClick={() => handleRemoveImage(index)}
                  sx={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    width: 20,
                    height: 20,
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}

        {/* -- Toolbar Row: Action icons + Post button -- */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #f0f0f0',
            pt: 1,
          }}
        >
          {/* Left side: media and formatting buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {/* Camera button: triggers hidden file input */}
            <IconButton
              size="small"
              sx={{ color: 'text.secondary' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <CameraAltOutlinedIcon sx={{ fontSize: 20 }} />
            </IconButton>

            {/* Hidden file input: accepts images, allows multiple selection */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageSelect}
            />

            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <EmojiEmotionsOutlinedIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <FormatListBulletedIcon sx={{ fontSize: 20 }} />
            </IconButton>

            {/* Promote button */}
            <Button
              size="small"
              startIcon={<CampaignOutlinedIcon sx={{ fontSize: 18 }} />}
              sx={{
                fontSize: '0.75rem',
                color: 'primary.main',
                textTransform: 'none',
                ml: 0.5,
              }}
            >
              Promote
            </Button>
          </Box>

          {/* Right side: Post submit button */}
          <Button
            variant="contained"
            size="small"
            endIcon={<SendIcon sx={{ fontSize: 16 }} />}
            onClick={handlePost}
            disabled={!content.trim()}
            sx={{
              borderRadius: 2,
              px: 2,
              fontSize: '0.8rem',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': { boxShadow: 'none' },
            }}
          >
            Post
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CreatePost;
