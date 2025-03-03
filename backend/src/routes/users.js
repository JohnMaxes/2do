const express = require('express');
const router = express.Router();
const { User } = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();
    console.log(`✅ User ${user._id} registered successfully!`);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    console.log(`✅ User ${user._id} logged in successfully!`);
    res.json({ message: 'User logged in successfully', token });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).send({ message: 'Internal Server Error', error: err.message });
  }
});

module.exports = router;