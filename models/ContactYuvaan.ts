import mongoose, { Schema } from 'mongoose';
const yuvaanContactSchema = new Schema({
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
  Subject: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const YuvaanContact = mongoose.models.YuvaanContact || mongoose.model('YuvaanContact', yuvaanContactSchema);
