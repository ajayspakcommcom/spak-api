import mongoose, { Schema, models } from 'mongoose';

const aStarCareerSchema = new Schema({
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

export const AStarCareer = mongoose.models.AStarCareer || mongoose.model('AStarCareer', aStarCareerSchema);
