const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'foodrush_jwt_secret_key';

exports.protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized. Please log in.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, username: decoded.username };
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
  }
};
