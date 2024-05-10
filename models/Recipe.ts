import mongoose, { Schema, models } from 'mongoose';

const recipeSchema = new Schema({
  FirstName: {
    type: String,
    required: true
  },
  LastName: {
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

export const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);
