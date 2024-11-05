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

// Signup route
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

      // Insert new user into users table
      db.query('INSERT INTO users (email, hashed_password) VALUES (?, ?)', [email, hashedPassword], (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to register user' });

        const userId = results.insertId;

        // Insert default profile for the user into profiles table
        const defaultProfile = { user_id: userId, avatar_url: 'https://cdn.builder.io/api/v1/image/assets/TEMP/64c9bda73ca89162bc806ea1e084a3cd2dccf15193fe0e3c0e8008a485352e26?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1', name: 'namee', belt: 'white', academy: 'unknown academy' };
        db.query('INSERT INTO profiles SET ?', defaultProfile, (err) => {
          if (err) return res.status(500).json({ error: 'Failed to create user profile' });

          // Generate access and refresh tokens
          const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
          const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

          // Send tokens in the response
          res.status(201).json({
            accessToken,
            refreshToken,
            message: 'User registered successfully and default profile created!'
          });
        });
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

// Profile retrieve
app.get('/api/profile', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token missing or invalid' });
  }

  const accessToken = authHeader.split(' ')[1];

  try {
    // Decode the token to extract the user_id
    const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // Retrieve profile information from profiles table
    db.query('SELECT * FROM profiles WHERE user_id = ?', [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database query error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      // Send profile data as a response
      res.json(results[0]);
    });
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired access token' });
  }
});

// Add Video Sequence Endpoint
app.post('/api/addpost', (req, res) => {
  const {
    id,
    title,
    video_url,
    owner_id,
    movement_type,
    starting_position,
    ending_position,
    sequence_start_time,
    public_status,
    language,
    notes
  } = req.body;

  const query = `
    INSERT INTO posts (
      id,
      title,
      video_url,
      owner_id,
      movement_type,
      starting_position,
      ending_position,
      sequence_start_time,
      public_status,
      language,
      notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      id,
      title,
      video_url,
      owner_id,
      movement_type,
      starting_position,
      ending_position,
      sequence_start_time,
      public_status,
      language,
      notes
    ],
    (err, results) => {
      if (err) {
        console.error('Error inserting video sequence:', err);
        return res.status(500).json({ error: 'Failed to add a new post' });
      }
      res.status(201).json({ message: 'Added a new post successfully!' });
    }
  );
});

// Endpoint to fetch a post by ID
app.get('/api/posts/:id', (req, res) => {
  const postId = req.params.id;

  const query = `
    SELECT 
      p.id,
      p.title,
      p.video_url,
      p.movement_type,
      p.starting_position,
      p.ending_position,
      p.sequence_start_time,
      p.public_status,
      p.language,
      p.notes,
      pr.avatar_url,
      pr.name,
      pr.belt
    FROM posts p
    JOIN profiles pr ON p.owner_id = pr.user_id
    WHERE p.id = ?
  `;

  db.query(query, [postId], (err, results) => {
    if (err) {
      console.error('Error fetching post:', err);
      return res.status(500).json({ error: 'Failed to fetch post' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(results[0]); // Return the first result
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
