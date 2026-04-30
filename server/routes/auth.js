const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const OTP = require('../models/OTP');
const { generateOTP, getOTPExpiry } = require('../utils/otp');
const { sendOTPEmail } = require('../utils/mailer');

// ─── POST /auth/send-otp ──────────────────────────────────────
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Valid email is required.' });
    }

    // Only allow the resume owner to login
    const ownerEmail = process.env.OWNER_EMAIL?.toLowerCase().trim();
    if (email.toLowerCase().trim() !== ownerEmail) {
      return res.status(403).json({ message: 'Unauthorized. Only the resume owner can login.' });
    }

    // Rate limit: delete any existing OTP for this email first
    await OTP.deleteMany({ email: email.toLowerCase() });

    const otp = generateOTP();
    const expiresAt = getOTPExpiry();

    await OTP.create({
      email: email.toLowerCase(),
      otp,
      expiresAt,
    });

    await sendOTPEmail(email, otp);

    res.json({ message: 'OTP sent successfully. Check your email.' });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
});

// ─── POST /auth/verify-otp ────────────────────────────────────
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const record = await OTP.findOne({ email: email.toLowerCase() });

    if (!record) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    }

    // Check expiry
    if (new Date() > record.expiresAt) {
      await OTP.deleteOne({ _id: record._id });
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Track failed attempts (max 5)
    if (record.attempts >= 5) {
      await OTP.deleteOne({ _id: record._id });
      return res.status(429).json({ message: 'Too many failed attempts. Please request a new OTP.' });
    }

    if (record.otp !== otp.trim()) {
      await OTP.updateOne({ _id: record._id }, { $inc: { attempts: 1 } });
      const remaining = 5 - (record.attempts + 1);
      return res.status(400).json({ message: `Invalid OTP. ${remaining} attempts remaining.` });
    }

    // ✅ Valid — delete OTP record immediately
    await OTP.deleteOne({ _id: record._id });

    // Generate JWT (24h expiry)
    const token = jwt.sign(
      { email: email.toLowerCase(), role: 'owner' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful.',
      token,
      expiresIn: '24h',
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ message: 'Verification failed. Please try again.' });
  }
});

// ─── GET /auth/verify-token ───────────────────────────────────
router.get('/verify-token', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
