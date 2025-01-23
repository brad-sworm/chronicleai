const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();
const secretKey = 'your_secret_key'; // Replace with your actual secret key

router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.json({ success: false, message: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = new User({ email, password: hashedPassword, username });
    await newUser.save();

    await sendEmail(email, 'Welcome!', 'Thank you for signing up!');

    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Signup failed. Please try again.' });
  }
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.json({ success: false, message: 'Invalid email or password' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.json({ success: false, message: 'Invalid email or password' });
      }
  
      const token = jwt.sign(
        { id: user._id, username: user.username, email: user.email },
        secretKey,
        { expiresIn: '1h' }
      );
  
      // Include `_id` in the user object
      res.json({
        success: true,
        token,
        user: { id: user._id, username: user.username, email: user.email },
      });
    } catch (error) {
      console.error('Sign in error:', error);
      res.status(500).json({ success: false, message: 'Sign in failed. Please try again.' });
    }
  });
  

module.exports = router;
