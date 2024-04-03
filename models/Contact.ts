import mongoose, { Schema, models } from 'mongoose';

const contactSchema = new Schema({
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
  QueryMessage: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
