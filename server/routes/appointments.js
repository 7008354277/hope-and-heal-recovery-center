import { Router } from 'express';
import Appointment from '../models/Appointment.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();
router.use(protect);

router.post('/', async (req, res) => {
  try {
    const { type, preferredDate, preferredTime, note } = req.body;
    const date = new Date(preferredDate);
    if (isNaN(date) || date < new Date(new Date().setHours(0, 0, 0, 0))) return res.status(400).json({ error: 'Choose a date from today onwards.' });
    const item = await Appointment.create({ user: req.user._id, type, preferredDate: date, preferredTime, note });
    res.status(201).json(item);
  } catch {
    res.status(400).json({ error: 'Please check the appointment details.' });
  }
});

router.get('/mine', async (req, res) => {
  res.json(await Appointment.find({ user: req.user._id }).sort({ preferredDate: -1 }).lean());
});

router.patch('/:id/cancel', async (req, res) => {
  const item = await Appointment.findOneAndUpdate({ _id: req.params.id, user: req.user._id, status: 'requested' }, { status: 'cancelled' }, { new: true });
  if (!item) return res.status(404).json({ error: 'Only pending requests can be cancelled.' });
  res.json(item);
});

router.get('/', adminOnly, async (_req, res) => {
  res.json(await Appointment.find().populate('user', 'name phone email').sort({ preferredDate: 1 }).limit(500).lean());
});

router.patch('/:id', adminOnly, async (req, res) => {
  const { status } = req.body;
  if (!['requested', 'confirmed', 'completed', 'cancelled'].includes(status)) return res.status(400).json({ error: 'Invalid status.' });
  const item = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!item) return res.status(404).json({ error: 'Not found.' });
  res.json(item);
});

export default router;
