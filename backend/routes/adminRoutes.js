const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');
const { protectAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Admin Login
// @route   POST /api/admin/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.json({
        success: true,
        data: {
          _id: admin._id,
          email: admin.email,
          token: generateToken(admin._id)
        }
      });
    } else {
      res.status(401).json({ success: false, data: { message: 'Invalid admin credentials' } });
    }
  } catch (error) {
    res.status(500).json({ success: false, data: { message: error.message } });
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
router.get('/users', protectAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, data: { message: error.message } });
  }
});

// @desc    Update user password
// @route   PUT /api/admin/users/:id/password
router.put('/users/:id/password', protectAdmin, async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, data: { message: 'User not found' } });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.json({ success: true, data: { message: 'User password updated successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, data: { message: error.message } });
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', protectAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, data: { message: 'User not found' } });
    }

    await user.deleteOne();
    res.json({ success: true, data: { message: 'User deleted successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, data: { message: error.message } });
  }
});

module.exports = router;
