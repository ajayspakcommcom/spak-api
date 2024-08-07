import mongoose, { Schema, models } from 'mongoose';

const counsellingSchema = new Schema({
  Name: {
    type: String,
    required: [true, 'A name is required']
  },
  Address: {
    type: String,
    required: [true, 'An address is required']
  },
  Mobile: {
    type: String,
    required: [true, 'A mobile number is required']
  },
  Qualification: {
    type: String,
    required: [true, 'A qualification is required']
  },
  Email: {
    type: String,
    required: [true, 'An email is required']
  },
  Age: {
    type: Number,
    required: [true, 'Age is required']
  },
  Created_At: {
    type: Date,
    default: Date.now
  }
});

export const Counselling = mongoose.models.Counselling || mongoose.model('Counselling', counsellingSchema);
