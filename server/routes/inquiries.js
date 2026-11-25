import { Router } from 'express';
import Inquiry from '../models/Inquiry.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();
const phoneRe = /^\+?[\d\s-]{8,16}$/;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;
    if (!name?.trim()) return res.status(400).json({ error: 'Enter your name.' });
    if (!phoneRe.test(phone || '')) return res.status(400).json({ error: 'Enter a valid phone number.' });
    if (email && !emailRe.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
    if (!message?.trim()) return res.status(400).json({ error: 'Write a short message.' });
    await Inquiry.create({ name, phone, email, subject, message });
    res.status(201).json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Something went wrong. Please call us instead.' });
  }
});

router.get('/', protect, adminOnly, async (_req, res) => {
  res.json(await Inquiry.find().sort({ createdAt: -1 }).limit(500).lean());
});

router.patch('/:id', protect, adminOnly, async (req, res) => {
  const { status } = req.body;
  if (!['new', 'contacted', 'closed'].includes(status)) return res.status(400).json({ error: 'Invalid status.' });
  const item = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!item) return res.status(404).json({ error: 'Not found.' });
  res.json(item);
});

export default router;
