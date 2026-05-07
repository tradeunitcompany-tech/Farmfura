const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const checkDB = () => {
  console.log(`🔍 Checking DB connection... State: ${mongoose.connection.readyState}`);
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database connection error. Please ensure your IP is whitelisted in MongoDB Atlas.');
  }
};

// Mock OTP storage (in production, use Redis or DB)
const otpStore = {};

// Send OTP
const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || phone.length < 10) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }

    // Mock OTP (always 1234)
    const otp = '1234';
    otpStore[phone] = {
      otp,
      timestamp: Date.now(),
      attempts: 0,
    };

    console.log(`📱 OTP for ${phone}: ${otp}`);
    
    res.json({
      success: true,
      message: 'OTP sent successfully',
      phone,
      mockOtp: otp, // For testing purposes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify OTP and create/login user
const verifyOTP = async (req, res) => {
  try {
    checkDB();
    const { phone, otp } = req.body;

    if (!otpStore[phone]) {
      return res.status(400).json({ error: 'OTP not found or expired' });
    }

    if (otpStore[phone].otp !== otp) {
      otpStore[phone].attempts += 1;
      if (otpStore[phone].attempts > 3) {
        delete otpStore[phone];
        return res.status(400).json({ error: 'Too many attempts. Request new OTP.' });
      }
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ phone, name: `User ${phone.slice(-4)}` });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    // Clean up OTP
    delete otpStore[phone];

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Email Register
const emailRegister = async (req, res) => {
  try {
    checkDB();
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Email Login
const emailLogin = async (req, res) => {
  try {
    checkDB();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Logout (frontend handles token deletion)
const logout = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

module.exports = {
  sendOTP,
  verifyOTP,
  emailRegister,
  emailLogin,
  logout,
};
