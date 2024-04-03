import mongoose, { Schema, models } from 'mongoose';

const brochureSchema = new Schema({
  Name: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  },
  Mobile: {
    type: String,
    required: true
  },
  CountrtName: {
    type: String,
    required: true
  },
  ProgrammeName: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Brochure = mongoose.models.Brochure || mongoose.model('Brochure', brochureSchema);
