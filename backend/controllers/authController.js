const User = require('../models/User');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'foodrush_jwt_secret_key';

const generateToken = (user) =>
  jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { username, password, confirmPassword } = req.body;

    if (!username || !password || !confirmPassword)
      return res.status(400).json({ success: false, message: 'All fields are required.' });

    if (username.trim().length < 3)
      return res.status(400).json({ success: false, message: 'Username must be at least 3 characters.' });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

    if (password !== confirmPassword)
      return res.status(400).json({ success: false, message: 'Passwords do not match. Please try again.' });

    const existing = await User.findOne({ username: username.trim() });
    if (existing)
      return res.status(400).json({ success: false, message: 'Username already taken. Please choose another.' });

    const user = await User.create({ username: username.trim(), password });
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to FoodRush 🎉',
      token,
      user: { id: user._id, username: user.username }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ success: false, message: 'Username and password are required.' });

    const user = await User.findOne({ username: username.trim() });
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });

    const token = generateToken(user);

    res.json({
      success: true,
      message: `Thanks for coming back, ${user.username}! Great to see you again 🙌`,
      token,
      user: { id: user._id, username: user.username }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};
