import { Router } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { sendMail } from '../utils/mailer.js';

const router = Router();
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^\+?[\d\s-]{8,16}$/;
const passRe = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');
const sign = (u) => jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const PROFILE_FIELDS = [
  'name', 'phone', 'registeringFor', 'patientName', 'age', 'gender', 'city', 'state', 'address',
  'substances', 'durationOfUse', 'previousTreatment', 'previousTreatmentDetails', 'program',
  'medicalConditions', 'currentMedications', 'mentalHealthConcerns',
  'emergencyName', 'emergencyRelation', 'emergencyPhone',
];
const pick = (src, keys) => Object.fromEntries(keys.filter((k) => src[k] !== undefined && src[k] !== '').map((k) => [k, src[k]]));

router.post('/register', async (req, res) => {
  try {
    const b = req.body;
    if (!b.name?.trim()) return res.status(400).json({ error: 'Enter your full name.' });
    if (!emailRe.test(b.email || '')) return res.status(400).json({ error: 'Enter a valid email address.' });
    if (!phoneRe.test(b.phone || '')) return res.status(400).json({ error: 'Enter a valid phone number.' });
    if (!passRe.test(b.password || '')) return res.status(400).json({ error: 'Password must be at least 8 characters with a letter and a number.' });
    if (!b.emergencyName?.trim() || !phoneRe.test(b.emergencyPhone || '')) return res.status(400).json({ error: 'Add an emergency contact name and phone number.' });
    if (b.consent !== true) return res.status(400).json({ error: 'Please accept the consent to continue.' });
    if (await User.findOne({ email: b.email.toLowerCase().trim() })) return res.status(409).json({ error: 'An account with this email already exists. Try logging in.' });

    const user = await User.create({ ...pick(b, PROFILE_FIELDS), email: b.email, password: b.password, consent: true });
    res.status(201).json({ token: sign(user), user: user.toSafe() });
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ error: 'Please check your details and try again.' });
    console.error(err);
    res.status(500).json({ error: 'Could not create your account. Please try again.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase().trim() });
  if (!user || !(await user.matches(password || ''))) return res.status(401).json({ error: 'Email or password is incorrect.' });
  res.json({ token: sign(user), user: user.toSafe() });
});

router.post('/forgot-password', async (req, res) => {
  const generic = { message: 'If an account exists for that email, a reset link has been sent. It is valid for 30 minutes.' };
  try {
    const user = await User.findOne({ email: (req.body.email || '').toLowerCase().trim() });
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      user.resetTokenHash = sha(token);
      user.resetTokenExpires = Date.now() + 30 * 60 * 1000;
      await user.save({ validateBeforeSave: false });
      const link = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${token}`;
      await sendMail({
        to: user.email,
        subject: 'Reset your Hope and Heal password',
        text: `Hello ${user.name},\n\nUse this link to set a new password (valid for 30 minutes):\n${link}\n\nIf you did not ask for this, you can ignore this email.`,
        html: `<p>Hello ${user.name},</p><p><a href="${link}">Set a new password</a> (valid for 30 minutes).</p><p>If you did not ask for this, you can ignore this email.</p>`,
      });
    }
  } catch (err) {
    console.error('forgot-password error:', err.message);
  }
  res.json(generic);
});

router.post('/reset-password/:token', async (req, res) => {
  if (!passRe.test(req.body.password || '')) return res.status(400).json({ error: 'Password must be at least 8 characters with a letter and a number.' });
  const user = await User.findOne({ resetTokenHash: sha(req.params.token), resetTokenExpires: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ error: 'This reset link is invalid or has expired. Request a new one.' });
  user.password = req.body.password;
  user.resetTokenHash = undefined;
  user.resetTokenExpires = undefined;
  await user.save();
  res.json({ message: 'Password updated. You can now log in.' });
});

router.get('/me', protect, (req, res) => res.json({ user: req.user.toSafe() }));

router.put('/me', protect, async (req, res) => {
  try {
    Object.assign(req.user, pick(req.body, PROFILE_FIELDS));
    await req.user.save();
    res.json({ user: req.user.toSafe() });
  } catch (err) {
    res.status(400).json({ error: 'Please check your details and try again.' });
  }
});

router.put('/password', protect, async (req, res) => {
  const { current, password } = req.body;
  if (!(await req.user.matches(current || ''))) return res.status(400).json({ error: 'Current password is incorrect.' });
  if (!passRe.test(password || '')) return res.status(400).json({ error: 'New password must be at least 8 characters with a letter and a number.' });
  req.user.password = password;
  await req.user.save();
  res.json({ message: 'Password changed.' });
});

export default router;
