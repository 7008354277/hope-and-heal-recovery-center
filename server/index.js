import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import auth from './routes/auth.js';
import inquiries from './routes/inquiries.js';
import appointments from './routes/appointments.js';
import admin from './routes/admin.js';
import reviews from './routes/reviews.js';

if (!process.env.JWT_SECRET) { console.error('Set JWT_SECRET in server/.env'); process.exit(1); }

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json({ limit: '50kb' }));

const limiter = (limit) => rateLimit({ windowMs: 15 * 60 * 1000, limit, standardHeaders: true, legacyHeaders: false });
app.use('/api/auth/login', limiter(20));
app.use('/api/auth/register', limiter(20));
app.use('/api/auth/forgot-password', limiter(10));
app.use('/api/inquiries', limiter(40));
const reviewPostLimit = rateLimit({ windowMs: 60 * 60 * 1000, limit: 6, standardHeaders: true, legacyHeaders: false });
app.use('/api/reviews', (req, res, next) => (req.method === 'POST' ? reviewPostLimit(req, res, next) : next()));

app.use('/api/auth', auth);
app.use('/api/inquiries', inquiries);
app.use('/api/appointments', appointments);
app.use('/api/admin', admin);
app.use('/api/reviews', reviews);
app.get('/api/health', (_req, res) => res.json({ ok: true }));

if (process.env.NODE_ENV === 'production') {
  const dist = path.join(__dirname, '../client/dist');
  app.use(express.static(dist));
  app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => app.listen(port, () => console.log(`API running on :${port}`)))
  .catch((err) => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
