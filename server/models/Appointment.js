import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['assessment-call', 'counselling', 'family-session', 'center-visit'], required: true },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, enum: ['morning', 'afternoon', 'evening'], default: 'morning' },
    note: { type: String, trim: true, maxlength: 500 },
    status: { type: String, enum: ['requested', 'confirmed', 'completed', 'cancelled'], default: 'requested' },
  },
  { timestamps: true }
);

export default mongoose.model('Appointment', schema);
