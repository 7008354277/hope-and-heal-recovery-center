import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    anonymous: { type: Boolean, default: false },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, maxlength: 100 },
    text: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
    relation: { type: String, enum: ['patient', 'family', 'friend', 'visitor', 'other'], default: 'other' },
    // New reviews wait for staff approval before they appear on the website.
    status: { type: String, enum: ['pending', 'approved', 'hidden'], default: 'pending', index: true },
    reply: { type: String, trim: true, maxlength: 600 },
  },
  { timestamps: true }
);

export default mongoose.model('Review', schema);
