// backend/controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'foodrush_jwt_secret_key';

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    // Validate input
    if (!username || username.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Username must be at least 3 characters',
      });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Check if username exists
    const existingUser = await User.findOne({ username: username.trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username already taken',
      });
    }

    // Create user
    const user = await User.create({
      username: username.trim(),
      password,
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to FoodRush 🍔',
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: `Thanks for coming back, ${user.username}! Great to see you again 🙌`,
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};