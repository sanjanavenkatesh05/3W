/**
 * Post.js (Model)
 * -----------------
 * Mongoose model for the Posts collection.
 *
 * Each post document stores:
 * - Author reference (links to Users collection)
 * - Text content and optional images (0-4)
 * - Engagement counters (like_count, share_count)
 * - Embedded comments array (avoids joins for the most common read)
 *
 * Indexes:
 *   created_at (descending)        - global feed sorted by newest
 *   author_id + created_at (desc)  - user-specific post queries
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// ---------------------------------------------------------------------------
// Comment Sub-Document Schema
// ---------------------------------------------------------------------------

/**
 * CommentSchema
 * Embedded inside each Post document. Stores the commenter's user_id,
 * their username (denormalized for display), and the comment text.
 */
const CommentSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Comment must have a user_id'],
  },

  username: {
    type: String,
    required: [true, 'Comment must include a username'],
    trim: true,
  },

  text: {
    type: String,
    required: [true, 'Comment text is required'],
    maxlength: [500, 'Comment cannot exceed 500 characters'],
    trim: true,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

// ---------------------------------------------------------------------------
// Post Schema
// ---------------------------------------------------------------------------

const PostSchema = new Schema({
  author_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post must have an author_id'],
  },

  content: {
    type: String,
    required: [true, 'Post content is required'],
    maxlength: [2000, 'Post content cannot exceed 2000 characters'],
    trim: true,
  },

  /* Array of image URLs or base64 data URIs (max 4 per post) */
  images: {
    type: [String],
    validate: {
      validator: function (arr) {
        return arr.length <= 4;
      },
      message: 'A post can have at most 4 images',
    },
    default: [],
  },

  like_count: {
    type: Number,
    default: 0,
    min: [0, 'Like count cannot be negative'],
  },

  share_count: {
    type: Number,
    default: 0,
    min: [0, 'Share count cannot be negative'],
  },

  comments: {
    type: [CommentSchema],
    default: [],
  },

  created_at: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

/* Compound index for user-specific feeds: "all posts by user X, newest first" */
PostSchema.index({ author_id: 1, created_at: -1 });

module.exports = mongoose.model('Post', PostSchema);
