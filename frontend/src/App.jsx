/**
 * App.jsx
 * ---------
 * Root application component for the Social Media app.
 *
 * Assembles all UI components into a single-page, mobile-first layout:
 * 1. TopBar (fixed top header)
 * 2. SearchBar
 * 3. CreatePost (with image upload and text posting)
 * 4. FilterTabs (scrollable feed filters)
 * 5. PostCard list (feed of posts from sample data + user-created posts)
 * 6. FloatingActionButton (fixed bottom-right)
 * 7. BottomNav (fixed bottom navigation)
 *
 * State management:
 * - Posts array is managed here so new posts from CreatePost appear at the
 *   top of the feed immediately.
 */

import React, { useState } from 'react';
import { Box } from '@mui/material';
import TopBar from './components/TopBar';
import SearchBar from './components/SearchBar';
import CreatePost from './components/CreatePost';
import FilterTabs from './components/FilterTabs';
import PostCard from './components/PostCard';
import FloatingActionButton from './components/FloatingActionButton';
import BottomNav from './components/BottomNav';
import samplePosts from './data/samplePosts';

function App() {
  /* -- Posts State --
   * Initialize with sample data. New posts are prepended to this array
   * when the user submits a post via CreatePost.
   */
  const [posts, setPosts] = useState(samplePosts);

  /**
   * handleCreatePost
   * Called by CreatePost component when the user submits a new post.
   * Creates a new post object with user-provided content and images,
   * then prepends it to the feed so it appears at the top.
   *
   * @param {Object} postData - { content: string, images: string[] }
   */
  const handleCreatePost = (postData) => {
    const newPost = {
      id: Date.now(),
      displayName: 'You',
      username: '@current_user',
      timestamp: new Date().toLocaleString('en-IN', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }),
      avatarColor: '#1976d2',
      content: postData.content,
      /* Extract hashtags from the content for styled rendering */
      hashtags: postData.content.match(/#\w+/g) || [],
      images: postData.images || [],
      likes: 0,
      comments: 0,
      shares: 0,
    };

    /* Prepend new post to show it at the top of the feed */
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <Box
      sx={{
        /* Container constrained to mobile width, centered on desktop */
        maxWidth: 480,
        mx: 'auto',
        minHeight: '100vh',
        backgroundColor: 'background.default',
        position: 'relative',
      }}
    >
      {/* -- Fixed Top Bar -- */}
      <TopBar />

      {/* -- Scrollable Content Area --
       * Padded top and bottom to account for fixed TopBar (56px)
       * and BottomNav (56px) heights.
       */}
      <Box sx={{ pt: '64px', pb: '72px' }}>
        {/* Search input and action icons */}
        <SearchBar />

        {/* Post creation card with text + image upload */}
        <CreatePost onCreatePost={handleCreatePost} />

        {/* Feed filter chips */}
        <FilterTabs />

        {/* -- Post Feed --
         * Renders each post as a PostCard.
         * Posts are keyed by their unique id for efficient React reconciliation.
         */}
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </Box>

      {/* -- Fixed UI Elements -- */}
      <FloatingActionButton />
      <BottomNav />
    </Box>
  );
}

export default App;
