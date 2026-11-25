import { Router } from 'express';
import Review from '../models/Review.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// Public: approved reviews + rating summary
router.get('/', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 100);
  const [items, agg] = await Promise.all([
    Review.find({ status: 'approved' }).sort({ createdAt: -1 }).limit(limit).lean(),
    Review.aggregate([{ $match: { status: 'approved' } }, { $group: { _id: '$rating', n: { $sum: 1 } } }]),
  ]);
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  agg.forEach((a) => { distribution[a._id] = a.n; });
  const count = Object.values(distribution).reduce((a, b) => a + b, 0);
  const total = Object.entries(distribution).reduce((s, [k, n]) => s + Number(k) * n, 0);
  res.json({
    summary: { count, average: count ? Math.round((total / count) * 10) / 10 : 0, distribution },
    reviews: items.map((r) => ({
      _id: r._id,
      name: r.anonymous ? 'Anonymous' : r.name,
      rating: r.rating,
      title: r.title,
      text: r.text,
      relation: r.relation,
      reply: r.reply,
      createdAt: r.createdAt,
    })),
  });
});

// Public: anyone can submit a review (held for approval)
router.post('/', async (req, res) => {
  try {
    const { name, anonymous, rating, title, text, relation, website } = req.body;
    if (website) return res.status(201).json({ ok: true }); // honeypot: bots fill hidden field
    if (!name?.trim()) return res.status(400).json({ error: 'Enter your name.' });
    const stars = Number(rating);
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) return res.status(400).json({ error: 'Choose a rating from 1 to 5 stars.' });
    if (!text || text.trim().length < 10) return res.status(400).json({ error: 'Please write at least a sentence about your experience.' });
    await Review.create({ name, anonymous: !!anonymous, rating: stars, title, text, relation });
    res.status(201).json({ ok: true });
  } catch {
    res.status(400).json({ error: 'Please check your review and try again.' });
  }
});

// Staff
router.get('/all', protect, adminOnly, async (req, res) => {
  const filter = ['pending', 'approved', 'hidden'].includes(req.query.status) ? { status: req.query.status } : {};
  res.json(await Review.find(filter).sort({ createdAt: -1 }).limit(500).lean());
});

router.patch('/:id', protect, adminOnly, async (req, res) => {
  const update = {};
  if (req.body.status !== undefined) {
    if (!['pending', 'approved', 'hidden'].includes(req.body.status)) return res.status(400).json({ error: 'Invalid status.' });
    update.status = req.body.status;
  }
  if (req.body.reply !== undefined) update.reply = String(req.body.reply).slice(0, 600);
  const item = await Review.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!item) return res.status(404).json({ error: 'Not found.' });
  res.json(item);
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
