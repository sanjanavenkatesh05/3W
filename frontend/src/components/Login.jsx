import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import api from '../services/api';

/**
 * Login.jsx
 * ----------
 * Minimalistic authentication screen. Handles both Login and Registration.
 * 
 * Props:
 *  - onLogin: Callback function invoked when authentication succeeds, passing token and user data.
 */
function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);

    try {
      let data;
      if (isRegistering) {
        data = await api.register({ email, password });
      } else {
        data = await api.login({ email, password });
      }

      if (data && data.token) {
        onLogin(data.token, data.user);
      }
    } catch (err) {
      console.error('Authentication error:', err);
      // The api.js wrapper throws Error objects with the server's message
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card sx={{ w: '100%', maxWidth: 400, p: 2, borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
            {isRegistering ? 'Create an Account' : 'Welcome Back'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, textAlign: 'center' }}>
            {isRegistering
              ? 'Enter your email and a password. You will be assigned a random username.'
              : 'Log in to join the conversation.'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.5,
                borderRadius: 5,
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : isRegistering ? (
                'Sign Up'
              ) : (
                'Log In'
              )}
            </Button>
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            </Typography>
            <Button
              variant="text"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
                setPassword('');
              }}
              sx={{ fontWeight: 600, textTransform: 'none' }}
              disabled={loading}
            >
              {isRegistering ? 'Log in instead' : 'Sign up now'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
