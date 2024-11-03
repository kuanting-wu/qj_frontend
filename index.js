const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

// Helper functions for generating tokens
const generateAccessToken = (user) => {
  return jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken = (user) => {
  const refreshToken = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  
  // Save refresh token in database
  db.query('INSERT INTO refresh_tokens (token, user_id) VALUES (?, ?)', [refreshToken, user.id]);
  
  return refreshToken;
};

// Signup Endpoint
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if the email already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Database query error' });
      if (results.length > 0) return res.status(400).json({ error: 'Email already exists' });

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      db.query('INSERT INTO users (email, hashed_password) VALUES (?, ?)', [email, hashedPassword], (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to register user' });

        const user = { id: results.insertId, email };

        // Send tokens in the response
        res.status(201).json({ accessToken, refreshToken, message: 'User registered successfully!' });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// Signin Endpoint
app.post('/api/signin', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ error: 'Invalid email or password' });

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.hashed_password);

    if (!passwordMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({ accessToken, refreshToken, message: 'Signin successful!' });
  });
});

// Token Refresh Endpoint
app.post('/api/refresh-token', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

  // Verify the refresh token
  db.query('SELECT * FROM refresh_tokens WHERE token = ?', [refreshToken], (err, results) => {
    if (err || results.length === 0) return res.status(403).json({ error: 'Invalid refresh token' });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Invalid refresh token' });

      const newAccessToken = generateAccessToken(user);
      res.json({ accessToken: newAccessToken });
    });
  });
});

// Signout Endpoint
app.post('/api/signout', (req, res) => {
  const { refreshToken } = req.body;

  db.query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to sign out' });
    res.json({ message: 'signed out successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
