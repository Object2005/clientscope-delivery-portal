const jwt = require('jsonwebtoken');
const { users } = require('../data/mockStore');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_75way_assessment_2027');

      // Check DB first if connected, otherwise fallback to mockStore
      try {
        const dbUser = await User.findById(decoded.id).select('-password');
        if (dbUser) {
          req.user = dbUser;
          return next();
        }
      } catch (err) {
        // Fallback to in-memory store
      }

      const mockUser = users.find((u) => u._id === decoded.id || u.email === decoded.email);
      if (mockUser) {
        req.user = {
          _id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role
        };
        return next();
      }

      return res.status(401).json({ success: false, message: 'User session expired or not found' });
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user ? req.user.role : 'Guest'}' is not authorized to access this resource`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
