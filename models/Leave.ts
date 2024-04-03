import mongoose, { Schema, models } from 'mongoose';

const leaveSchema = new Schema({
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

export const Leave = mongoose.models.Leave || mongoose.model('Leave', leaveSchema);
