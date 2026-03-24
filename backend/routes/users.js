/**
 * users.js (Routes)
 * -------------------
 * Express router for user-related API endpoints.
 *
 * Endpoints:
 *   GET  /api/users/:id - Fetch a user profile by ID
 *   POST /api/users     - Register a new user
 *
 * All responses return JSON. Errors include a message field.
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ---------------------------------------------------------------------------
// GET /api/users/:id -- Get User Profile
// ---------------------------------------------------------------------------

/**
 * Fetches a single user by their MongoDB _id.
 *
 * Response: User object { _id, username, email, created_at }
 */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/users -- Register User
// ---------------------------------------------------------------------------

/**
 * Creates a new user account.
 *
 * Request body:
 *   username (string, required) - Unique display name (3-30 chars)
 *   email    (string, required) - Unique email address
 *
 * Response: The created user object.
 * Error 409: If username or email already exists.
 */
router.post('/', async (req, res) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ message: 'Username and email are required' });
    }

    const user = await User.create({
      username: username.trim(),
      email: email.trim(),
    });

    res.status(201).json(user);
  } catch (error) {
    /* Handle duplicate key errors (username or email already taken) */
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        message: `A user with that ${field} already exists`,
      });
    }

    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
});

module.exports = router;
