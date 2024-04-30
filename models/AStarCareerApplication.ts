import mongoose, { Schema, models } from 'mongoose';

const aStarCareerApplicationSchema = new Schema({
  Name: {
    type: String,
    default: null
  },
  Mobile: {
    type: String,
    default: null
  },
  Position: {
    type: String,
    default: null
  },
  ImageUrl: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const AStarCareerApplication = mongoose.models.AStarCareerApplication || mongoose.model('AStarCareerApplication', aStarCareerApplicationSchema);
