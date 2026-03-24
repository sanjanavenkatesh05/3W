/**
 * posts.js (Routes)
 * -------------------
 * Express router for all post-related API endpoints.
 *
 * Endpoints:
 *   GET    /api/posts              - Fetch global feed (paginated, newest first)
 *   POST   /api/posts              - Create a new post
 *   PATCH  /api/posts/:id/like     - Increment like count
 *   PATCH  /api/posts/:id/share    - Increment share count
 *   POST   /api/posts/:id/comments - Add a comment to a post
 *
 * All responses return JSON. Errors include a message field for the frontend.
 */

const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const requireAuth = require('../middleware/auth');

// ---------------------------------------------------------------------------
// GET /api/posts -- Global Feed
// ---------------------------------------------------------------------------

/**
 * Fetches all posts sorted by newest first, with pagination.
 *
 * Query parameters:
 *   page  (default: 1)  - Page number
 *   limit (default: 20) - Posts per page
 *
 * Response: Array of post objects, each populated with author username.
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author_id', 'username email')
      .lean();

    /**
     * Transform each post into the shape the frontend expects.
     * The frontend PostCard component expects: id, displayName, username,
     * timestamp, avatarColor, content, hashtags, images, likes, comments, shares.
     */
    const transformedPosts = posts.map((post) => ({
      id: post._id,
      _id: post._id,
      displayName: post.author_id?.username || 'Unknown',
      username: `@${post.author_id?.username || 'unknown'}`,
      timestamp: new Date(post.created_at).toLocaleString('en-IN', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }),
      avatarColor: generateAvatarColor(post.author_id?.username || ''),
      content: post.content,
      hashtags: post.content.match(/#\w+/g) || [],
      images: post.images || [],
      likes: post.like_count,
      comments: post.comments.length,
      commentsList: post.comments,
      shares: post.share_count,
    }));

    res.json(transformedPosts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/posts -- Create Post
// ---------------------------------------------------------------------------

/**
 * Creates a new post. (Protected)
 *
 * Request body:
 *   content   (string, required) - Text content of the post
 *   images    (string[], optional) - Array of image URLs/data URIs (max 4)
 *
 * Response: The created post in the frontend-expected shape.
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const { content, images } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Post content is required' });
    }

    const post = await Post.create({
      author_id: req.user.id,
      content: content.trim(),
      images: (images || []).slice(0, 4),
    });

    /* Populate author info for the response */
    await post.populate('author_id', 'username email');

    /* Transform to the frontend-expected shape */
    const response = {
      id: post._id,
      _id: post._id,
      displayName: post.author_id?.username || 'You',
      username: `@${post.author_id?.username || 'user'}`,
      timestamp: new Date(post.created_at).toLocaleString('en-IN', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }),
      avatarColor: generateAvatarColor(post.author_id?.username || 'user'),
      content: post.content,
      hashtags: post.content.match(/#\w+/g) || [],
      images: post.images,
      likes: 0,
      comments: 0,
      commentsList: [],
      shares: 0,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// ---------------------------------------------------------------------------
// PATCH /api/posts/:id/like -- Like a Post
// ---------------------------------------------------------------------------

/**
 * Toggles the like status of a post for the current user (Protected).
 * If already liked, unlikes it ($pull, count -1).
 * If not liked, likes it ($addToSet, count +1).
 *
 * Response: Updated post object.
 */
router.patch('/:id/like', requireAuth, async (req, res) => {
  try {
    const postToLike = await Post.findById(req.params.id);
    if (!postToLike) return res.status(404).json({ message: 'Post not found' });

    const isLiked = postToLike.liked_by.includes(req.user.id);

    let updateQuery;
    if (isLiked) {
      updateQuery = { $pull: { liked_by: req.user.id }, $inc: { like_count: -1 } };
    } else {
      updateQuery = { $addToSet: { liked_by: req.user.id }, $inc: { like_count: 1 } };
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      updateQuery,
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Failed to like post' });
  }
});

// ---------------------------------------------------------------------------
// PATCH /api/posts/:id/share -- Share a Post
// ---------------------------------------------------------------------------

/**
 * Increments the share_count of a post by 1.
 * Uses MongoDB's $inc operator for atomic updates.
 *
 * Response: Updated post object.
 */
router.patch('/:id/share', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { share_count: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error sharing post:', error);
    res.status(500).json({ message: 'Failed to share post' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/posts/:id/comments -- Add Comment
// ---------------------------------------------------------------------------

/**
 * Pushes a new comment into the post's comments array (Protected).
 *
 * Request body:
 *   text (string, required) - Comment text
 *
 * Response: Updated post object with the new comment.
 */
router.post('/:id/comments', requireAuth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const comment = {
      user_id: req.user.id,
      username: req.user.username,
      text: text.trim(),
    };

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: comment } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
});

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * generateAvatarColor
 * Generates a deterministic hex color from a username string.
 * Ensures the same user always gets the same avatar color.
 *
 * @param {string} str - Username string
 * @returns {string} Hex color code (e.g., "#a1b2c3")
 */
function generateAvatarColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = '#' + ((hash >> 0) & 0xffffff).toString(16).padStart(6, '0');
  return color;
}

module.exports = router;
