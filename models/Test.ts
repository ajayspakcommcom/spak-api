import mongoose, { Schema, models } from 'mongoose';

const testSchema = new Schema({
  reason: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Test = mongoose.models.Test || mongoose.model('Test', testSchema);
