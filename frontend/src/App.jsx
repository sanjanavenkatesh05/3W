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
 * 5. PostCard list (feed of posts from API or local sample data)
 * 6. FloatingActionButton (fixed bottom-right)
 * 7. BottomNav (fixed bottom navigation)
 *
 * Data flow:
 * - On mount, attempts to fetch posts from the backend API (Render).
 * - If the API is not configured (VITE_API_URL is empty), falls back
 *   to local sample data so the UI still works during development.
 * - New posts are sent to the API if available, then prepended locally.
 *
 * Theme management:
 * - Dark mode state is managed here and passed to SearchBar's toggle button.
 * - ThemeProvider wraps the entire tree so all MUI components respond to mode changes.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TopBar from './components/TopBar';
import SearchBar from './components/SearchBar';
import CreatePost from './components/CreatePost';
import FilterTabs from './components/FilterTabs';
import PostCard from './components/PostCard';
import FloatingActionButton from './components/FloatingActionButton';
import BottomNav from './components/BottomNav';
import Login from './components/Login';
import samplePosts from './data/samplePosts';
import api from './services/api';
import createAppTheme from './theme';

function App() {
  /* -- Dark Mode State --
   * Controls the theme mode. Toggled by the moon/sun button in SearchBar.
   */
  const [darkMode, setDarkMode] = useState(false);

  /* Memoize the theme object so it only rebuilds when darkMode changes */
  const theme = useMemo(
    () => createAppTheme(darkMode ? 'dark' : 'light'),
    [darkMode]
  );

  /* -- Auth State -- */
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (!saved || saved === 'undefined') return null;
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse user from localStorage', e);
      return null;
    }
  });

  const handleLogin = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    api.setToken(newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    api.setToken(null);
    setToken(null);
    setUser(null);
  };

  /* -- Posts State --
   * Stores the array of post objects currently displayed in the feed.
   * Initialized empty; populated by API response or sample data on mount.
   */
  const [posts, setPosts] = useState([]);

  /* Loading state: true while fetching posts from the API */
  const [loading, setLoading] = useState(true);

  /**
   * useEffect -- Fetch Posts on Mount
   * Attempts to load posts from the backend API.
   * If the API call returns null (URL not configured) or fails,
   * falls back to local sample data.
   */
  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await api.getPosts();

        if (data && Array.isArray(data)) {
          /* API returned valid data: use it */
          setPosts(data);
        } else {
          /* API not configured (returned null): use sample data */
          setPosts(samplePosts);
        }
      } catch (error) {
        console.error('Failed to fetch posts from API:', error);
        /* Fallback to sample data on any error */
        setPosts(samplePosts);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  /**
   * handleCreatePost
   * Called by CreatePost component when the user submits a new post.
   * 1. Attempts to send the post to the backend API.
   * 2. If API returns the created post, uses that (includes server-generated _id).
   * 3. If API is unavailable, creates a local-only post object.
   * 4. Prepends the new post to the feed so it appears at the top.
   *
   * @param {Object} postData - { content: string, images: string[] }
   */
  const handleCreatePost = async (postData) => {
    try {
      /* Attempt to create the post via API */
      const apiPost = await api.createPost({
        content: postData.content,
        images: postData.images || [],
      });

      if (apiPost) {
        /* API succeeded: prepend the server-created post */
        setPosts((prev) => [apiPost, ...prev]);
        return;
      }
    } catch (error) {
      console.error('Failed to create post via API:', error);
    }

    /* Helper to generate consistent avatar color based on username */
    const hashStr = user ? user.username : 'You';
    let hash = 0;
    for (let i = 0; i < hashStr.length; i++) {
      hash = hashStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = '#' + ((hash >> 0) & 0xffffff).toString(16).padStart(6, '0');

    /* Fallback: create a local-only post when API is unavailable */
    const localPost = {
      id: Date.now(),
      displayName: user ? user.username : 'You',
      username: `@${user ? user.username : 'current_user'}`,
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
      avatarColor: color,
      content: postData.content,
      /* Extract hashtags from the content for styled rendering */
      hashtags: postData.content.match(/#\w+/g) || [],
      images: postData.images || [],
      likes: 0,
      comments: 0,
      commentsList: [],
      shares: 0,
    };

    setPosts((prev) => [localPost, ...prev]);
  };

  // If unauthenticated, show the Login screen
  if (!token) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
        <TopBar user={user} onLogout={handleLogout} />

        {/* -- Scrollable Content Area --
         * Padded top and bottom to account for fixed TopBar (56px)
         * and BottomNav (56px) heights.
         */}
        <Box sx={{ pt: '64px', pb: '72px' }}>
          {/* Search input with dark mode toggle */}
          <SearchBar
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode((prev) => !prev)}
          />

          {/* Post creation card with text + image upload */}
          <CreatePost onCreatePost={handleCreatePost} />

          {/* Feed filter chips */}
          <FilterTabs />

          {/* -- Post Feed --
           * Shows a loading spinner while fetching from API.
           * Once loaded, renders each post as a PostCard.
           * Posts are keyed by their unique id (or _id from MongoDB).
           */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id || post._id} post={post} currentUser={user} />
            ))
          )}
        </Box>

        {/* -- Fixed UI Elements -- */}
        <FloatingActionButton />
        <BottomNav />
      </Box>
    </ThemeProvider>
  );
}

export default App;
