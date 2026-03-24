// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

/**
 * requireAuth Middleware
 * -----------------------
 * Verifies that a valid JWT token is provided in the Authorization header.
 * If valid, extracts the user payload and attaches it to req.user.
 * Otherwise, returns a 401 Unauthorized response.
 */
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Note: We use a hardcore secret for development, but ideally it should be in .env
    const secret = process.env.JWT_SECRET || 'fallback_secret_for_development_3w';
    const decoded = jwt.verify(token, secret);
    
    // Attach user payload (e.g., { id: '...', username: '...' }) to the request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = requireAuth;
