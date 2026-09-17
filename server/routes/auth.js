/**
 * Authentication Routes for MĀRG-DRISHTI Portal
 */

const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { generateToken, authenticate } = require('../middleware/auth');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new Citizen or Civic Officer account
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, department, badgeNumber, jurisdiction } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide full name, valid email address, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters in length.'
      });
    }

    // Role validation
    const validRoles = ['citizen', 'officer', 'admin'];
    const assignedRole = validRoles.includes(role) ? role : 'citizen';

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      phone,
      department: assignedRole === 'officer' ? (department || 'Civic Road Authority') : '',
      badgeNumber: assignedRole === 'officer' ? (badgeNumber || '') : '',
      jurisdiction: assignedRole === 'officer' ? (jurisdiction || '') : ''
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: `Account created successfully as ${user.role}.`,
      token,
      user
    });
  } catch (err) {
    console.error('[Auth Register Error]:', err.message);
    return res.status(400).json({
      success: false,
      error: err.message || 'Registration failed.'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both email address and password.'
      });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. No registered account found with this email.'
      });
    }

    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Incorrect password.'
      });
    }

    const safeUser = User.sanitize(user);
    const token = generateToken(safeUser);

    return res.json({
      success: true,
      message: `Welcome back, ${safeUser.name}!`,
      token,
      user: safeUser
    });
  } catch (err) {
    console.error('[Auth Login Error]:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Authentication server error. Please try again.'
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get profile for currently authenticated user
 * @access  Private (Bearer JWT)
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve profile.'
    });
  }
});

/**
 * @route   PATCH /api/auth/profile
 * @desc    Update user profile details
 * @access  Private (Bearer JWT)
 */
router.patch('/profile', authenticate, async (req, res) => {
  try {
    const updated = await User.updateProfile(req.user._id, req.body);
    return res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updated
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message || 'Profile update failed.'
    });
  }
});

/**
 * @route   GET /api/auth/demo-accounts
 * @desc    Return pre-configured demo logins for one-click reviewer evaluation
 * @access  Public
 */
router.get('/demo-accounts', (req, res) => {
  return res.json({
    success: true,
    demoAccounts: [
      {
        label: 'Citizen Road Reporter',
        role: 'citizen',
        email: 'citizen@example.com',
        password: 'password123',
        description: 'Report road hazards, track status of submitted complaints, earn civic points.',
        badge: 'Citizen Sentinel'
      },
      {
        label: 'NHAI Nodal Officer',
        role: 'officer',
        email: 'officer@nhai.gov.in',
        password: 'password123',
        description: 'National Highways Authority of India nodal engineer for NH / Expressways.',
        badge: 'NHAI Chief Eng.'
      },
      {
        label: 'Delhi PWD Executive Engineer',
        role: 'officer',
        email: 'officer@pwd.delhi.gov.in',
        password: 'password123',
        description: 'Public Works Department authority managing state highways and arterial rings.',
        badge: 'PWD Exec. Eng.'
      },
      {
        label: 'MCD South Zone Inspector',
        role: 'officer',
        email: 'inspector@mcd.gov.in',
        password: 'password123',
        description: 'Municipal Corporation officer handling local colony and sector roads.',
        badge: 'MCD Inspector'
      }
    ]
  });
});

module.exports = router;
