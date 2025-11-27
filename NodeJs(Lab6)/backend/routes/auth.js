import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

const getSecret = () => {
  const s = process.env.JWT_SECRET;
  if (!s) {
    console.error('[CONFIG][JWT] JWT_SECRET is NOT set in environment');
    return null;
  }
  return s;
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ msg: 'Missing fields' });

    const safeEmail = email.toLowerCase();
    const existing = await User.findOne({ email: safeEmail });
    if (existing) return res.status(400).json({ msg: 'User exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: safeEmail, password: hash });
    console.log(`[AUTH][REGISTER] Created user ${safeEmail} (${user._id})`);
    return res.status(201).json({ msg: 'Registered', userId: user._id });
  } catch (err) {
    console.error('[AUTH][REGISTER] Error:', err.stack || err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    console.log(`[AUTH][LOGIN] Attempt: ${email} at ${new Date().toISOString()}`);
    if (!email || !password) return res.status(400).json({ msg: 'Missing credentials' });

    const safeEmail = email.toLowerCase();
    const user = await User.findOne({ email: safeEmail });
    if (!user) {
      console.log(`[AUTH][LOGIN] User not found: ${safeEmail}`);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log(`[AUTH][LOGIN] Password mismatch for: ${safeEmail}`);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const secret = getSecret();
    if (!secret) {
      console.error('[AUTH][LOGIN] Cannot sign token: JWT_SECRET missing');
      return res.status(500).json({ error: 'Server misconfiguration: JWT_SECRET missing' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '7d' });
    console.log(`[AUTH][LOGIN] Success: ${safeEmail} — token issued`);
    return res.json({ token, name: user.name });
  } catch (err) {
    console.error('[AUTH][LOGIN] Error:', err.stack || err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
