/**
 * schemas.js
 * -----------
 * MongoDB schema definitions for the Social Media application.
 * Uses Mongoose ODM (Object Document Mapper) to define document structure,
 * validation rules, indexes, and defaults for two collections:
 *
 * 1. Users  -- stores unique user profiles
 * 2. Posts  -- stores post content, images, and all engagement data
 *              (likes, shares, comments) in a single document
 *
 * Design rationale:
 * - Embedding comments inside the Post document avoids expensive joins
 *   for the most common read operation (loading a post with its comments).
 * - Like and share counts are stored as integers for fast sorting/filtering.
 * - The author_id reference links each post to a user without duplicating
 *   the full user profile in every post.
 * - A descending index on created_at enables an efficient global feed query.
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

// ---------------------------------------------------------------------------
// USERS COLLECTION
// ---------------------------------------------------------------------------

/**
 * UserSchema
 * ----------
 * Represents a registered user in the application.
 *
 * Fields:
 *   username  -- unique display name, required, trimmed of whitespace
 *   email     -- unique email address, required, stored in lowercase
 *   created_at -- auto-set timestamp when the account is created
 *
 * Indexes:
 *   username  -- unique index for fast lookups and duplicate prevention
 *   email     -- unique index for authentication and duplicate prevention
 */
const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address',
    ],
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

// ---------------------------------------------------------------------------
// POSTS COLLECTION
// ---------------------------------------------------------------------------

/**
 * CommentSchema (embedded sub-document)
 * --------------------------------------
 * Represents a single comment on a post. Embedded directly inside the
 * Post document to co-locate related data and avoid separate queries.
 *
 * Fields:
 *   user_id    -- reference to the Users collection (who commented)
 *   username   -- denormalized username for display without extra lookups
 *   text       -- the comment body, required, up to 500 characters
 *   created_at -- auto-set timestamp for chronological ordering
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

/**
 * PostSchema
 * ----------
 * Represents a single post in the social feed. All engagement data
 * (likes, shares, comments) is stored within the post document itself.
 *
 * Fields:
 *   author_id   -- reference to the user who created the post
 *   content     -- the text body of the post
 *   images      -- array of image URLs (0 to 4 images per post)
 *   like_count  -- integer count of likes, defaults to 0
 *   share_count -- integer count of shares, defaults to 0
 *   comments    -- array of embedded CommentSchema sub-documents
 *   created_at  -- auto-set timestamp, indexed descending for feed sorting
 *
 * Indexes:
 *   created_at (descending) -- enables the global feed query:
 *       db.posts.find().sort({ created_at: -1 })
 *   author_id  -- enables fetching all posts by a specific user
 */
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
    index: true,  // indexed for efficient feed sorting
  },
});

/**
 * Compound index on author_id for user-specific post queries.
 * Example: "show me all posts by user X, newest first"
 */
PostSchema.index({ author_id: 1, created_at: -1 });

// ---------------------------------------------------------------------------
// MODEL EXPORTS
// ---------------------------------------------------------------------------

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);

module.exports = { User, Post };
