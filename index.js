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

// Signup route
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if the email already exists
    db.query('SELECT * FROM users WHERE email = ? OR name = ?', [email, name], async (err, results) => {
      if (err) return res.status(500).json({ error: 'Database query error' });

      if (results.length > 0) {
        // Determine which field(s) are causing the conflict
        const emailExists = results.some(user => user.email === email);
        const nameExists = results.some(user => user.name === name);

        // Respond accordingly
        if (emailExists && nameExists) {
          return res.status(400).json({ error: 'Email and name already exist' });
        } else if (emailExists) {
          return res.status(400).json({ error: 'Email already exists' });
        } else if (nameExists) {
          return res.status(400).json({ error: 'Name already exists' });
        }
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user into users table
      db.query('INSERT INTO users (name, email, hashed_password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to register user' });

        // Insert default profile for the user into profiles table
        const defaultProfile = { user_name: name, avatar_url: 'https://cdn.builder.io/api/v1/image/assets/TEMP/64c9bda73ca89162bc806ea1e084a3cd2dccf15193fe0e3c0e8008a485352e26?placeholderIfAbsent=true&apiKey=ee54480c62b34c3d9ff7ccdcccbf22d1', name: '', belt: '', academy: '' };
        db.query('INSERT INTO profiles SET ?', defaultProfile, (err) => {
          if (err) return res.status(500).json({ error: 'Failed to create user profile' });

          res.status(201).json({
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

    const refreshToken = generateRefreshToken(user);
    const accessToken = generateAccessToken(refreshToken);

    res.json({ accessToken, refreshToken, message: 'Signin successful!' });
  });
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


// Endpoint to fetch a post by ID
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

app.get('/api/search', (req, res) => {
  const {
    search = '',
    postBy = '',
    movementType = '',
    startingPosition = '',
    endingPosition = '',
    public_status = '',
    language = '',
    sortOption = 'newToOld',
  } = req.query;

  // Define sort order based on sortOption
  const sortOrder = sortOption === 'oldToNew' ? 'ASC' : 'DESC';

  // SQL Query with flexible filtering
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
      AND (LOWER(pr.name) LIKE LOWER(?) OR ? = '')
      AND (LOWER(p.movement_type) LIKE LOWER(?) OR ? = '')
      AND (LOWER(p.starting_position) LIKE LOWER(?) OR ? = '')
      AND (LOWER(p.ending_position) LIKE LOWER(?) OR ? = '')
      AND (LOWER(p.public_status) LIKE LOWER(?) OR ? = '')
      AND (LOWER(p.language) LIKE LOWER(?) OR ? = '')
    ORDER BY p.created_at ${sortOrder}
  `;

  // Preparing query parameters with flexible matching
  const queryParams = [
    `%${search}%`, search,
    `%${postBy}%`, postBy,
    `%${movementType}%`, movementType,
    `%${startingPosition}%`, startingPosition,
    `%${endingPosition}%`, endingPosition,
    `%${public_status}%`, public_status,
    `%${language}%`, language,
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


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
