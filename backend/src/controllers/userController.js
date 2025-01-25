const Log = require('../models/Log');
const logAction = require('../utils/logger');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// Enable 2FA
exports.enable2FA = async (req, res) => {
  try {
    const { _id } = req.user;
    const secret = speakeasy.generateSecret({ name: 'HospitalManagementApp' });

    await User.findByIdAndUpdate(_id, {
      twoFactorSecret: secret.base32,
      twoFactorEnabled: true,
    });

    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
    res.status(200).json({ message: '2FA enabled successfully', qrCodeUrl });
  } catch (error) {
    console.error('Error enabling 2FA:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Verify 2FA
exports.verify2FA = async (req, res) => {
  try {
    const { token } = req.body;
    const { _id } = req.user;

    const user = await User.findById(_id);
    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return res.status(400).json({ message: '2FA is not enabled for this account' });
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (isValid) {
      res.status(200).json({ message: '2FA verification successful' });
    } else {
      res.status(400).json({ message: 'Invalid 2FA token' });
    }
  } catch (error) {
    console.error('Error verifying 2FA:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Create user
exports.createUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    if (!name || !email || !role || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      role,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error during user creation:', error.message);
    res.status(400).json({ error: error.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials: user not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials: wrong password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await logAction(req.user.id, 'UPDATE', 'User', req.params.id);
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error during user deletion:', error.message);
    res.status(500).json({ error: error.message });
  }
};

