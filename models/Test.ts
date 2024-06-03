import mongoose, { Schema, models } from 'mongoose';

const testSchema = new Schema({
  title: String,
  author: String,
  body: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number
  }
});

testSchema.add({ createdAt: { type: Date, default: Date.now } });

testSchema.virtual('firstName').get(function () {
  return `${this.title} ${this.author}`;
})

export const Test = mongoose.models.Test || mongoose.model('Test', testSchema);
