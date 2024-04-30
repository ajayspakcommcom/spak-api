import mongoose, { Schema, models } from 'mongoose';

const aStarCareerApplicationSchema = new Schema({
  Name: {
    type: String,
    required: true
  },
  Mobile: {
    type: String,
    required: true
  },
  Position: {
    type: String,
    required: true
  },
  ImageUrl: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const AStarCareerApplication = mongoose.models.AStarCareerApplication || mongoose.model('AStarCareerApplication', aStarCareerApplicationSchema);
