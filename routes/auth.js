const express = require('express');
const bcrypt = require('bcrypt');
const userModel = require('../models/userData');
const { isAuthenticated } = require('../middleware/auth');

const router = express.Router();
const BCRYPT_ROUNDS = 12;

router.post('/signup', async (req, res) => {
  const { uname, pswd, age, email } = req.body;

  if (!uname || !pswd || !age || !email) {
    return res.status(400).json({ error: { code: 'VALIDATION_FAILED', message: 'All fields are required' } });
  }

  try {
    const existing = await userModel.findOne({ uname });
    if (existing) {
      return res.status(409).json({ error: { code: 'USER_EXISTS', message: 'Username already taken' } });
    }

    const hashedPass = await bcrypt.hash(pswd, BCRYPT_ROUNDS);
    await new userModel({ uname, pass: hashedPass, age: Number(age), email, files: [] }).save();

    return res.status(201).json({ message: 'Account created' });
  } catch (err) {
    console.error('Signup error:', err.message);
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Signup failed' } });
  }
});

router.post('/login', async (req, res) => {
  const { uname, pswd } = req.body;

  if (!uname || !pswd) {
    return res.status(400).json({ error: { code: 'VALIDATION_FAILED', message: 'Username and password required' } });
  }

  try {
    const user = await userModel.findOne({ uname });
    if (!user) {
      return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' } });
    }

    const valid = await bcrypt.compare(pswd, user.pass);
    if (!valid) {
      return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' } });
    }

    req.session.user = { id: user._id.toString(), uname: user.uname };
    return res.json({ message: 'Logged in', user: { uname: user.uname } });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Login failed' } });
  }
});

router.post('/logout', isAuthenticated, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Logout failed' } });
    }
    res.clearCookie('connect.sid');
    return res.json({ message: 'Logged out' });
  });
});

router.get('/me', isAuthenticated, (req, res) => {
  return res.json({ user: req.session.user });
});

module.exports = router;
