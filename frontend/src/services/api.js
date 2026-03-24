/**
 * api.js
 * -------
 * Centralized API service for communicating with the backend (Render).
 *
 * All HTTP requests to the backend go through this module. It:
 * - Reads the base URL from the VITE_API_URL environment variable
 * - Provides helper functions for each API operation (CRUD for posts, users)
 * - Handles JSON parsing and error responses consistently
 * - Falls back gracefully when the backend URL is not configured yet
 *
 * Usage in components:
 *   import api from '../services/api';
 *   const posts = await api.getPosts();
 */

/* -- Base URL Configuration --
 * Vite injects environment variables at build time via import.meta.env.
 * VITE_API_URL should be set to the Render backend URL (e.g., https://your-app.onrender.com).
 * When empty, API calls will be skipped and components will use local state only.
const BASE_URL = import.meta.env.VITE_API_URL || '';

let currentToken = localStorage.getItem('token') || null;

/**
 * request
 * --------
 * Generic fetch wrapper that handles JSON serialization, headers, and errors.
 *
 * @param {string} endpoint - API path (e.g., "/api/posts")
 * @param {Object} options  - Fetch options (method, body, etc.)
 * @returns {Object} Parsed JSON response
 * @throws {Error} If the response is not OK (status >= 400)
 */
async function request(endpoint, options = {}) {
  /* If no backend URL is configured, return null to signal local-only mode */
  if (!BASE_URL) {
    console.warn('VITE_API_URL is not set. API calls are disabled. Using local data only.');
    return null;
  }

  const url = `${BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  /* Attach JWT token if available */
  if (currentToken) {
    config.headers['Authorization'] = `Bearer ${currentToken}`;
  }

  /* If the body is an object, serialize it to JSON */
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);

  /* Handle non-OK responses by throwing with status info */
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `API Error: ${response.status}`);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  /* Parse and return the JSON response body */
  return response.json();
}

// ---------------------------------------------------------------------------
// API Methods -- Posts
// ---------------------------------------------------------------------------

const api = {
  /**
   * setToken
   * Updates the API service's internal token state.
   */
  setToken: (token) => {
    currentToken = token;
  },

  /**
   * login
   * Authenticates a user and returns their token and profile.
   */
  login: (credentials) => {
    return request('/api/auth/login', {
      method: 'POST',
      body: credentials,
    });
  },

  /**
   * register
   * Creates a new user account.
   */
  register: (credentials) => {
    return request('/api/auth/register', {
      method: 'POST',
      body: credentials,
    });
  },

  /**
   * getPosts
   * Fetches the global feed of posts, sorted newest first.
   * Backend endpoint: GET /api/posts
   *
   * @param {number} page  - Page number for pagination (default 1)
   * @param {number} limit - Number of posts per page (default 20)
   * @returns {Array} Array of post objects
   */
  getPosts: (page = 1, limit = 20) => {
    return request(`/api/posts?page=${page}&limit=${limit}`);
  },

  /**
   * createPost
   * Submits a new post to the backend.
   * Backend endpoint: POST /api/posts
   *
   * @param {Object} postData - { content: string, images: string[] }
   * @returns {Object} The created post object with generated _id
   */
  createPost: (postData) => {
    return request('/api/posts', {
      method: 'POST',
      body: postData,
    });
  },

  /**
   * likePost
   * Increments the like count on a specific post.
   * Backend endpoint: PATCH /api/posts/:id/like
   *
   * @param {string} postId - The MongoDB _id of the post
   * @returns {Object} Updated post object
   */
  likePost: (postId) => {
    return request(`/api/posts/${postId}/like`, {
      method: 'PATCH',
    });
  },

  /**
   * addComment
   * Adds a comment to a specific post.
   * Backend endpoint: POST /api/posts/:id/comments
   *
   * @param {string} postId      - The MongoDB _id of the post
   * @param {Object} commentData - { text: string }
   * @returns {Object} Updated post object with new comment
   */
  addComment: (postId, commentData) => {
    return request(`/api/posts/${postId}/comments`, {
      method: 'POST',
      body: commentData,
    });
  },

  /**
   * sharePost
   * Increments the share count on a specific post.
   * Backend endpoint: PATCH /api/posts/:id/share
   *
   * @param {string} postId - The MongoDB _id of the post
   * @returns {Object} Updated post object
   */
  sharePost: (postId) => {
    return request(`/api/posts/${postId}/share`, {
      method: 'PATCH',
    });
  },

  // -------------------------------------------------------------------------
  // API Methods -- Users
  // -------------------------------------------------------------------------

  /**
   * getUser
   * Fetches a user profile by ID.
   * Backend endpoint: GET /api/users/:id
   *
   * @param {string} userId - The MongoDB _id of the user
   * @returns {Object} User profile object
   */
  getUser: (userId) => {
    return request(`/api/users/${userId}`);
  },

  /**
   * createUser
   * Registers a new user.
   * Backend endpoint: POST /api/users
   *
   * @param {Object} userData - { username: string, email: string }
   * @returns {Object} The created user object
   */
  createUser: (userData) => {
    return request('/api/users', {
      method: 'POST',
      body: userData,
    });
  },
};

export default api;
