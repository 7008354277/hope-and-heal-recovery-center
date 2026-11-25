import { Router } from 'express';
import User, { STATUSES } from '../models/User.js';
import Inquiry from '../models/Inquiry.js';
import Appointment from '../models/Appointment.js';
import Review from '../models/Review.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();
router.use(protect, adminOnly);

router.get('/stats', async (_req, res) => {
  const [registrations, newInquiries, pendingAppointments, pendingReviews, byStatus] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Inquiry.countDocuments({ status: 'new' }),
    Appointment.countDocuments({ status: 'requested' }),
    Review.countDocuments({ status: 'pending' }),
    User.aggregate([{ $match: { role: 'user' } }, { $group: { _id: '$admissionStatus', count: { $sum: 1 } } }]),
  ]);
  res.json({ registrations, newInquiries, pendingAppointments, pendingReviews, byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])) });
});

router.get('/users', async (req, res) => {
  const q = (req.query.q || '').trim();
  const filter = { role: 'user' };
  if (q) {
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: re }, { email: re }, { phone: re }, { patientName: re }];
  }
  res.json(await User.find(filter).select('-password -resetTokenHash -resetTokenExpires').sort({ createdAt: -1 }).limit(500).lean());
});

router.patch('/users/:id/status', async (req, res) => {
  if (!STATUSES.includes(req.body.status)) return res.status(400).json({ error: 'Invalid status.' });
  const user = await User.findOneAndUpdate({ _id: req.params.id, role: 'user' }, { admissionStatus: req.body.status }, { new: true });
  if (!user) return res.status(404).json({ error: 'Not found.' });
  res.json(user.toSafe());
});

export default router;
