import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';

const { ADMIN_NAME = 'Center Admin', ADMIN_EMAIL, ADMIN_PASSWORD, MONGODB_URI } = process.env;
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) { console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env'); process.exit(1); }

await mongoose.connect(MONGODB_URI);
const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
if (existing) {
  existing.role = 'admin';
  await existing.save();
  console.log(`Existing account ${ADMIN_EMAIL} promoted to admin.`);
} else {
  await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, phone: '0000000000', password: ADMIN_PASSWORD, role: 'admin', consent: true });
  console.log(`Admin created: ${ADMIN_EMAIL}`);
}
await mongoose.disconnect();
