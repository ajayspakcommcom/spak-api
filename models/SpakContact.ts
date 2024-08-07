import mongoose, { Schema, models } from 'mongoose';

const contactSchema = new Schema({
  Name: {
    type: String,
    required: [true, 'A name is required']
  },
  Email: {
    type: String,
    required: [true, 'An email is required']
  },
  Mobile: {
    type: String,
    required: [true, 'A mobile number is required']
  },
  Message: {
    type: String,
    required: [true, 'A message is required']
  },
  Created_At: {
    type: Date,
    default: Date.now
  }
});

export const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);
