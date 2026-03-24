/**
 * server.js
 * ----------
 * Main entry point for the Social Media backend API server.
 *
 * Responsibilities:
 * - Load environment variables from .env
 * - Connect to MongoDB Atlas via Mongoose
 * - Configure Express middleware (CORS, JSON parsing)
 * - Mount API route handlers
 * - Start the HTTP server on the configured port
 *
 * The server is designed for deployment on Render, with the frontend
 * hosted separately on Vercel. CORS is configured to allow cross-origin
 * requests from the frontend domain.
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

/* -- Express Application Setup -- */
const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

/**
 * CORS Configuration
 * Allows cross-origin requests from the frontend (Vercel).
 * ALLOWED_ORIGIN should be set to the Vercel deployment URL.
 * When not set, defaults to allowing all origins (development mode).
 */
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

/**
 * JSON Body Parser
 * Parses incoming request bodies as JSON.
 * Limit set to 10mb to accommodate base64-encoded image data in posts.
 */
app.use(express.json({ limit: '10mb' }));

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

/* Mount post-related routes at /api/posts */
app.use('/api/posts', postRoutes);

/* Mount user-related routes at /api/users */
app.use('/api/users', userRoutes);

/* Mount auth-related routes at /api/auth */
app.use('/api/auth', authRoutes);

/**
 * Health Check Endpoint
 * Returns a simple JSON response to verify the server is running.
 * Useful for Render's health check configuration.
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// ---------------------------------------------------------------------------
// Database Connection and Server Start
// ---------------------------------------------------------------------------

/**
 * connectAndStart
 * Connects to MongoDB Atlas using the MONGODB_URI environment variable,
 * then starts the Express server. Exits with an error if the connection fails.
 */
async function connectAndStart() {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error('MONGODB_URI is not set in environment variables.');
      console.error('Set it in your .env file or Render environment settings.');
      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB Atlas');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}

connectAndStart();
