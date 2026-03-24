/**
 * User.js (Model)
 * -----------------
 * Mongoose model for the Users collection.
 *
 * Fields:
 *   username   - Unique display name (3-30 chars, required, trimmed)
 *   email      - Unique email address (required, lowercase, validated)
 *   created_at - Auto-set timestamp on document creation
 *
 * Indexes:
 *   username (unique) - fast lookups, prevents duplicate usernames
 *   email (unique)    - fast lookups, prevents duplicate emails
 */

const mongoose = require('mongoose');
const { Schema } = mongoose;

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

module.exports = mongoose.model('User', UserSchema);
