import mongoose, { Schema, models } from 'mongoose';

const heritageContactSchema = new Schema({
  Name: {
    type: String,
    required: true
  },
  Email: {
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

export const HeritageContact = mongoose.models.HeritageContact || mongoose.model('HeritageContact', heritageContactSchema);
