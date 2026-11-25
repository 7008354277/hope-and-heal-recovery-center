import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export const STATUSES = ['registered', 'under-review', 'assessment-scheduled', 'in-treatment', 'aftercare', 'closed'];

const userSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 8 },

    // Who is the program for
    registeringFor: { type: String, enum: ['self', 'family', 'friend'], default: 'self' },
    patientName: { type: String, trim: true, maxlength: 100 },
    age: { type: Number, min: 10, max: 100 },
    gender: { type: String, enum: ['male', 'female', 'other', 'prefer-not'], default: 'prefer-not' },
    city: { type: String, trim: true, maxlength: 80 },
    state: { type: String, trim: true, maxlength: 80 },
    address: { type: String, trim: true, maxlength: 300 },

    // Substance use & history
    substances: [{ type: String, enum: ['alcohol', 'opioids', 'cannabis', 'stimulants', 'sedatives', 'tobacco', 'other'] }],
    durationOfUse: { type: String, enum: ['less-than-1', '1-3', '3-5', '5-plus', 'not-sure'], default: 'not-sure' },
    previousTreatment: { type: Boolean, default: false },
    previousTreatmentDetails: { type: String, trim: true, maxlength: 500 },
    program: {
      type: String,
      enum: ['detox-support', 'counselling', 'relapse-prevention', 'aftercare', 'family-therapy', 'not-sure'],
      default: 'not-sure',
    },

    // Health
    medicalConditions: { type: String, trim: true, maxlength: 500 },
    currentMedications: { type: String, trim: true, maxlength: 500 },
    mentalHealthConcerns: { type: String, trim: true, maxlength: 500 },

    // Emergency contact
    emergencyName: { type: String, trim: true, maxlength: 100 },
    emergencyRelation: { type: String, trim: true, maxlength: 50 },
    emergencyPhone: { type: String, trim: true },

    consent: { type: Boolean, default: false },
    admissionStatus: { type: String, enum: STATUSES, default: 'registered' },

    resetTokenHash: String,
    resetTokenExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.methods.matches = function (plain) {
  return bcrypt.compare(plain, this.password);
};
userSchema.methods.toSafe = function () {
  const o = this.toObject();
  delete o.password; delete o.resetTokenHash; delete o.resetTokenExpires; delete o.__v;
  return o;
};

export default mongoose.model('User', userSchema);
