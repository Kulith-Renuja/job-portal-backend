const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware: Verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with Bearer
  // Token should come in Authorization header as: Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get the token (remove "Bearer " from the start)
      token = req.headers.authorization.split(' ')[1];

      // Decode token using secret key (from .env)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info to the request, except password
      req.user = await User.findById(decoded.id).select('-password'); // attach user info (no password)

      // Go to next middleware or controller
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token found in Authorization header
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware: Check if user is admin
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access only' });
  }
};
