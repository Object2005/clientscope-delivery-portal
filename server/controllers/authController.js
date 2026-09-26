const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { users } = require('../data/mockStore');

const generateToken = (id, email, role) => {
  return jwt.sign(
    { id, email, role },
    process.env.JWT_SECRET || 'super_secret_jwt_key_75way_assessment_2027',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user (Admin / Manager)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and password'
      });
    }

    // Check duplicate in mock store
    const existingMock = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingMock) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Try MongoDB
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists with this email' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'manager'
      });

      const token = generateToken(user._id, user.email, user.role);

      return res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token
        }
      });
    } catch (dbErr) {
      // Fallback in-memory
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: `usr_${Date.now()}`,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: role || 'manager',
        createdAt: new Date()
      };

      users.push(newUser);
      const token = generateToken(newUser._id, newUser.email, newUser.role);

      return res.status(201).json({
        success: true,
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          token
        }
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Check MongoDB first
    try {
      const user = await User.findOne({ email });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const token = generateToken(user._id, user.email, user.role);
          return res.json({
            success: true,
            data: {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              token
            }
          });
        }
      }
    } catch (err) {
      // Continue to mock store
    }

    // Check mock store
    const mockUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (mockUser) {
      // Support password 'admin123' or direct match
      const isMatch =
        password === 'admin123' ||
        (await bcrypt.compare(password, mockUser.password));

      if (isMatch) {
        const token = generateToken(mockUser._id, mockUser.email, mockUser.role);
        return res.json({
          success: true,
          data: {
            _id: mockUser._id,
            name: mockUser.name,
            email: mockUser.email,
            role: mockUser.role,
            token
          }
        });
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials. Please verify your email and password.'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
