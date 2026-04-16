const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendVerificationEmail, sendResetPasswordEmail } = require('../utils/sendEmail');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(`[AUTH] Registering user: ${email}`);
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, data: { message: 'User already exists' } });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken
    });

    // Send Verification Email using specialized function
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    try {
      await sendVerificationEmail({
        to: user.email,
        username: user.name,
        verificationLink
      });
      console.log(`[AUTH] Verification email sent to ${user.email}`);
    } catch (err) {
      console.error('[AUTH] Email send failed:', err.message);
    }

    res.status(201).json({
      success: true,
      data: {
        message: 'Registration successful. Please check your email to verify your account.'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, data: { message: error.message } });
  }
});

// @desc    Verify email token
// @route   GET /api/auth/verify/:token
router.get('/verify/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });

    if (!user) {
      return res.status(400).json({ success: false, data: { message: 'Verification failed. The link may be invalid or expired.' } });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ success: true, data: { message: 'Email verified successfully! You can now log in.' } });
  } catch (error) {
    res.status(500).json({ success: false, data: { message: error.message } });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified) {
        return res.status(401).json({ success: false, data: { message: 'Please verify your email before logging in' } });
      }

      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({ success: false, data: { message: 'Invalid credentials' } });
    }
  } catch (error) {
    res.status(500).json({ success: false, data: { message: error.message } });
  }
});

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, data: { message: 'There is no user with that email' } });
    }

    // Generate token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try {
      await sendResetPasswordEmail({
        to: user.email,
        resetLink
      });
      res.json({ success: true, data: { message: 'Reset link sent to email' } });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(500).json({ success: false, data: { message: 'Email could not be sent' } });
    }
  } catch (error) {
    res.status(500).json({ success: false, data: { message: error.message } });
  }
});

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, data: { message: 'Invalid or expired reset token' } });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, data: { message: 'Password reset successful' } });
  } catch (error) {
    res.status(500).json({ success: false, data: { message: error.message } });
  }
});

module.exports = router;
