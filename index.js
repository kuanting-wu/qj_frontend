const express = require('express');
const axios = require('axios');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

// Create the SES client with credentials from .env
const client = new SESClient({
  region: process.env.AWS_REGION, // Access AWS region from environment variables
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

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
  port: process.env.DB_PORT || 3306,
  connectTimeout: 10000, // 10 seconds
  enableKeepAlive: true,
  keepAliveInitialDelay: 0, // Start keep-alive immediately
});

const generateAccessToken = (refreshToken) => {
  try {
    const decodedToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    return jwt.sign(
      { user_name: decodedToken.user_name, email: decodedToken.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  } catch (error) {
    console.error("Invalid or expired refresh token:", error);
    throw new Error("Invalid or expired refresh token");
  }
};

const generateRefreshToken = (user) => {
  return jwt.sign({ user_name: user.name, email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired access token' });
    }
    req.user = user; // Store user information from token in request
    next();
  });
};

app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if the email or name already exists
    db.query('SELECT * FROM users WHERE name = ?', [name], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Database query error' });

      if (results.length > 0) {
        const userWithName = results.find(user => user.name === name); // Find the user object with the same name

        if (userWithName) {
          if (userWithName.email === email) {
            // Username exists and belongs to the same email
            if (userWithName.email_verified) {
              // Username exists, belongs to the same email, and is verified
              return res.status(400).json({
                error: 'Name and email already exist and are verified'
              });
            } else {
              // Username exists, belongs to the same email, but is not verified yet
              // Delete the existing user and proceed to insert a new user below
              db.query('DELETE FROM users WHERE id = ?', [userWithName.id], (err) => {
                if (err) {
                  return res.status(500).json({ error: 'Failed to delete existing unverified user' });
                }
                console.log('Unverified user deleted successfully');
                // Continue with new user creation logic (insert user again)
              });
            }
          } else {
            // Username exists and belongs to a different email
            return res.status(400).json({ error: 'Name is already in use by another user' });
          }
        }
      }



      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate a unique verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token expires in 24 hours
      const tokenExpiryUTC = tokenExpiry.toISOString(); // "2024-11-15T12:00:00.000Z"

      // Insert the new user into the database with email_verified set to false
      db.query(
        'INSERT INTO users (name, email, hashed_password, verification_token, verification_token_expiry, email_verified, reset_token, reset_token_expiry) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, email, hashedPassword, verificationToken, tokenExpiryUTC, false, null, null],
        (err, results) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to register user' });
          }

          // Insert default profile for the user into the profiles table
          const defaultProfile = {
            user_name: name,
            avatar_url: 'https://cdn.builder.io/api/v1/image/assets/TEMP/64c9bda73ca89162bc806ea1e084a3cd2dccf15193fe0e3c0e8008a485352e26?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1',
            name: '',
            belt: '',
            academy: ''
          };

          db.query('INSERT INTO profiles SET ?', defaultProfile, async (err) => {
            if (err) return res.status(500).json({ error: 'Failed to create user profile' });

            // Send verification email using Amazon SES
            const verificationLink = `https://quantifyjiujitsu.com/verify-email?token=${verificationToken}`;

            // Create the SES email parameters
            const params = {
              Source: 'no-reply@quantifyjiujitsu.com', // SES verified email
              Destination: {
                ToAddresses: [email], // Recipient email
              },
              Message: {
                Subject: {
                  Data: 'Email Verification - Quantify Jiu-Jitsu',
                },
                Body: {
                  Html: {
                    Data: `<p>Hi ${name},</p><p>Please verify your email by clicking the link below:</p><p><a href="${verificationLink}">Verify Email</a></p>`
                  },
                },
              },
            };

            try {
              // Send the email via SES
              const command = new SendEmailCommand(params);
              const data = await client.send(command);
              console.log('Email sent successfully:');

              // Respond after successful registration and email sent
              res.status(201).json({ message: 'User registered successfully! Check your email to verify your account.' });
            } catch (error) {
              console.error('Error sending verification email:', error);
              res.status(500).json({ error: 'Failed to send verification email' });
            }
          });
        }
      );
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

    if (user.email_verified !== 1) {  // Checks if it's not equal to 1
      return res.status(400).json({ error: 'Please verify your email before signing in' });
    }

    // If email is verified (user.email_verified === 1), continue to password check
    const passwordMatch = await bcrypt.compare(password, user.hashed_password);
    if (!passwordMatch) return res.status(400).json({ error: 'Invalid email or password' });

    // Generate refresh and access tokens
    const refreshToken = generateRefreshToken(user);
    const accessToken = generateAccessToken(refreshToken);

    // Respond with accessToken, refreshToken, email_verified, and a message
    res.json({
      accessToken,
      refreshToken,
      email_verified: user.email_verified,
      message: 'Signin successful!',
    });
  });
});

app.get('/api/verify-email', (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  // Query the database for the token and check its expiry
  db.query(
    'SELECT id FROM users WHERE verification_token = ? AND verification_token_expiry > NOW()',
    [token],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }

      const userId = results[0].id;

      // Update the user's verification status
      db.query(
        'UPDATE users SET email_verified = TRUE, verification_token = NULL, verification_token_expiry = NULL WHERE id = ?',
        [userId],
        (err) => {
          if (err) {
            console.error('Failed to update user:', err);
            return res.status(500).json({ error: 'Failed to verify email' });
          }

          res.status(200).json({ message: 'Email verified successfully!' });
        }
      );
    }
  );
});

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if the email exists in the database
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Database query error' });

      if (results.length === 0) {
        return res.status(404).json({ error: 'Email not found' });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // Token expires in 1 hour
      const tokenExpiryUTC = tokenExpiry.toISOString(); // "2024-11-15T12:00:00.000Z"

      // Update the user with the reset token and expiry
      db.query(
        'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?',
        [resetToken, tokenExpiryUTC, email],
        async (err) => {
          if (err) return res.status(500).json({ error: 'Failed to generate reset token' });

          // Generate the reset link
          const resetLink = `https://quantifyjiujitsu.com/reset-password?token=${resetToken}`;

          // Prepare the SES email parameters
          const params = {
            Source: 'no-reply@quantifyjiujitsu.com', // SES verified email
            Destination: {
              ToAddresses: [email],
            },
            Message: {
              Subject: {
                Data: 'Password Reset - Quantify Jiu-Jitsu',
              },
              Body: {
                Html: {
                  Data: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`,
                },
              },
            },
          };

          try {
            // Send the email via SES
            const command = new SendEmailCommand(params);
            const data = await client.send(command);
            console.log('Password reset email sent successfully:');

            // Respond after successful email sent
            res.status(200).json({ message: 'Password reset email sent successfully!' });
          } catch (error) {
            console.error('Error sending reset email:', error);
            res.status(500).json({ error: 'Failed to send password reset email' });
          }
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  db.query(
    'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
    [token],
    async (err, results) => {
      if (err) return res.status(500).json({ error: 'Database query error' });

      if (results.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      db.query(
        'UPDATE users SET hashed_password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
        [hashedPassword, results[0].id],
        (err) => {
          if (err) return res.status(500).json({ error: 'Failed to reset password' });

          res.status(200).json({ message: 'Password reset successfully!' });
        }
      );
    }
  );
});

// Token Refresh Endpoint
app.post('/api/refresh-token', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }
  try {
    const newAccessToken = generateAccessToken(refreshToken);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ error: error.message });
  }
});

// Profile retrieve
app.get('/api/profile/:user_name', async (req, res) => {
  const userName = req.params.user_name;

  // Check if user_name is provided
  if (!userName) {
    return res.status(400).json({ error: 'User name is required' });
  }

  try {
    // Query the profiles table for the specified user_name
    db.query(
      'SELECT * FROM profiles WHERE user_name = ?',
      [userName],
      (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          return res.status(500).json({ error: 'Database query error' });
        }

        // Check if a profile was found
        if (results.length === 0) {
          return res.status(404).json({ error: 'Profile not found' });
        }

        // Send the profile data as a response
        res.json(results[0]);
      }
    );
  } catch (error) {
    console.error('Error retrieving profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Assuming authenticateToken is a middleware function that verifies the user's token
app.put('/api/editprofile/:user_name', authenticateToken, async (req, res) => {
  const userName = req.params.user_name;
  const { name, belt, academy } = req.body;

  // Check if user_name and required fields are provided
  if (!userName) {
    return res.status(400).json({ error: 'User name is required' });
  }
  if (!name || !belt || !academy) {
    return res.status(400).json({ error: 'Name, belt, and academy are required' });
  }

  // Ensure the authenticated user is updating their own profile
  if (req.user.user_name !== userName) {
    return res.status(403).json({ error: 'User not authorized to edit this profile' });
  }

  try {
    // Update the profiles table with the new data
    db.query(
      'UPDATE profiles SET name = ?, belt = ?, academy = ? WHERE user_name = ?',
      [name, belt, academy, userName],
      (err, results) => {
        if (err) {
          console.error('Database update error:', err);
          return res.status(500).json({ error: 'Database update error' });
        }

        // Check if a row was updated (meaning the profile was found and modified)
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: 'Profile not found' });
        }

        // Send a success message
        res.json({ message: 'Profile updated successfully' });
      }
    );
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add Video Sequence Endpoint
app.post('/api/newpost/:id', authenticateToken, (req, res) => {
  const {
    title,
    video_id,
    video_platform,
    movement_type,
    starting_position,
    ending_position,
    sequence_start_time,
    public_status,
    language,
    notes
  } = req.body;

  const { id } = req.params;
  const owner_name = req.user.user_name; // Get the authenticated user's name

  const query = `
    INSERT INTO posts (
      id,
      title,
      video_id,
      video_platform,
      owner_name,
      movement_type,
      starting_position,
      ending_position,
      sequence_start_time,
      public_status,
      language,
      notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      id,
      title,
      video_id,
      video_platform,
      owner_name,
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

app.put('/api/editpost/:id', authenticateToken, (req, res) => {
  const postId = req.params.id;
  const {
    title,
    video_id,
    video_platform,
    movement_type,
    starting_position,
    ending_position,
    sequence_start_time,
    public_status,
    language,
    notes
  } = req.body;

  // First, check if the post exists and get the owner's name
  const selectQuery = 'SELECT owner_name FROM posts WHERE id = ?';
  db.query(selectQuery, [postId], (err, results) => {
    if (err) {
      console.error('Error retrieving post:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    // If post not found, return a 404 error
    if (results.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the authenticated user is the owner of the post
    const postOwner = results[0].owner_name;
    if (req.user.user_name !== postOwner) {
      return res.status(403).json({ error: 'User not authorized to edit this post' });
    }

    // Proceed with updating the post if the user is the owner
    const updateQuery = `
      UPDATE posts
      SET
        title = ?,
        video_id = ?,
        video_platform = ?,
        movement_type = ?,
        starting_position = ?,
        ending_position = ?,
        sequence_start_time = ?,
        public_status = ?,
        language = ?,
        notes = ?
      WHERE id = ?
    `;

    db.query(
      updateQuery,
      [
        title,
        video_id,
        video_platform,
        movement_type,
        starting_position,
        ending_position,
        sequence_start_time,
        public_status,
        language,
        notes,
        postId
      ],
      (updateErr, updateResults) => {
        if (updateErr) {
          console.error('Error updating post:', updateErr);
          return res.status(500).json({ error: 'Failed to update the post' });
        }

        // If no rows were affected, the update failed
        if (updateResults.affectedRows === 0) {
          return res.status(404).json({ error: 'Post not found or not updated' });
        }

        // Send a success message
        res.json({ message: 'Post updated successfully' });
      }
    );
  });
});

app.delete('/api/deletepost/:id', authenticateToken, (req, res) => {
  const postId = req.params.id;

  // Check if the post exists and retrieve the owner's name
  const selectQuery = 'SELECT owner_name FROM posts WHERE id = ?';
  db.query(selectQuery, [postId], (err, results) => {
    if (err) {
      console.error('Error retrieving post:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    // If the post is not found, return a 404 error
    if (results.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if the authenticated user is the owner of the post
    const postOwner = results[0].owner_name;
    if (req.user.user_name !== postOwner) {
      return res.status(403).json({ error: 'User not authorized to delete this post' });
    }

    // Proceed with deleting the post if the user is the owner
    const deleteQuery = 'DELETE FROM posts WHERE id = ?';
    db.query(deleteQuery, [postId], (deleteErr, deleteResults) => {
      if (deleteErr) {
        console.error('Error deleting post:', deleteErr);
        return res.status(500).json({ error: 'Failed to delete the post' });
      }

      // If no rows were affected, the deletion failed
      if (deleteResults.affectedRows === 0) {
        return res.status(404).json({ error: 'Post not found or already deleted' });
      }

      // Send a success message
      res.json({ message: 'Post deleted successfully' });
    });
  });
});

app.get('/api/viewpost/:id', (req, res) => {
  const postId = req.params.id;
  const query = `
    SELECT 
      p.id,
      p.title,
      p.video_id,
      p.video_platform,
      p.movement_type,
      p.starting_position,
      p.ending_position,
      p.sequence_start_time,
      p.public_status,
      p.language,
      p.notes,
      pr.user_name,
      pr.avatar_url,
      pr.name,
      pr.belt
    FROM posts p
    JOIN profiles pr ON p.owner_name = pr.user_name
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

app.get('/api/search', authenticateToken, (req, res) => {
  const {
    search = '',
    postBy = '',
    movementType = '',
    startingPosition = '',
    endingPosition = '',
    publicStatus = '',
    language = '',
    sortOption = 'newToOld',
  } = req.query;
  const sortOrder = sortOption === 'oldToNew' ? 'ASC' : 'DESC';

  // Check if a user is authenticated; if yes, get their username
  const currentUser = req.user ? req.user.user_name : null;
  // SQL Query with conditional private post access
  const query = `
  SELECT 
    p.id,
    p.video_id,
    p.video_platform,
    p.title,
    pr.user_name,
    pr.name,
    pr.belt,
    pr.avatar_url,
    p.movement_type,
    p.created_at
  FROM posts p
  JOIN profiles pr ON p.owner_name = pr.user_name
  WHERE 1=1
    AND (LOWER(p.title) LIKE LOWER(?) OR ? = '')
    AND (
      LOWER(pr.name) = LOWER(?) OR
      LOWER(pr.user_name) = LOWER(?) OR
      ? = ''
    )
    AND (LOWER(p.movement_type) LIKE LOWER(?) OR ? = '')
    AND (LOWER(p.starting_position) LIKE LOWER(?) OR ? = '')
    AND (LOWER(p.ending_position) LIKE LOWER(?) OR ? = '')
    AND (LOWER(p.language) LIKE LOWER(?) OR ? = '')
    AND (
      -- Case 1: public_status is empty, show all public posts and private posts if owned by currentUser
      (? = '' AND (LOWER(p.public_status) = 'public' OR (LOWER(p.public_status) = 'private' AND pr.user_name = ?)))
      OR
      -- Case 2: public_status is 'public', show only public posts
      (? = 'Public' AND LOWER(p.public_status) = 'public')
      OR
      -- Case 3: public_status is 'private', show only private posts if owned by currentUser
      (? = 'Private' AND LOWER(p.public_status) = 'private' AND pr.user_name = ?)
    )
  ORDER BY p.created_at ${sortOrder}
`;

  const queryParams = [
    `%${search}%`, search,
    postBy, postBy, postBy, // Exact match for pr.name or pr.user_name
    `%${movementType}%`, movementType,
    `%${startingPosition}%`, startingPosition,
    `%${endingPosition}%`, endingPosition,
    `%${language}%`, language,
    publicStatus, currentUser,  // Case 1: public or private posts if owned by currentUser
    publicStatus,               // Case 2: public posts only
    publicStatus, currentUser    // Case 3: private posts if owned by currentUser
  ];

  // Execute the query
  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching posts:', err);
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }

    // Map the results to the desired structure
    const formattedResults = results.map(post => ({
      id: post.id,
      video_id: post.video_id,
      video_platform: post.video_platform,
      title: post.title,
      user_name: post.user_name,
      name: post.name,
      belt: post.belt,
      avatar_url: post.avatar_url,
      movement_type: post.movement_type,
      created_at: post.created_at,
    }));

    // Return all matching posts
    res.status(200).json({ posts: formattedResults });
  });
});

app.get('/api/proxy-image', async (req, res) => {
  const { bvid } = req.query;

  if (!bvid) {
    return res.status(400).json({ error: 'bvid query parameter is required' });
  }

  try {
    // Fetch the Bilibili video data using the bvid
    const bilibiliResponse = await axios.get(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`);

    // Extract the thumbnail URL
    const thumbnailUrl = bilibiliResponse.data.data.pic;

    // Fetch the image data from the thumbnail URL
    const imageResponse = await axios.get(thumbnailUrl, { responseType: 'arraybuffer' });

    // Set content type and send the image data as the response
    res.set('Content-Type', 'image/jpeg');
    res.send(imageResponse.data);
  } catch (error) {
    console.error('Error fetching Bilibili thumbnail:', error);
    res.status(500).json({ error: 'Failed to fetch thumbnail from Bilibili' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
