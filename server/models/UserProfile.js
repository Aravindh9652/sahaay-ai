const mongoose = require('mongoose')

const userProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  phone: String,
  location: String,
  language: { type: String, default: 'en' },
  avatar: String,
  bio: String,
  skills: [String],
  interests: [String],
  joinedDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
})

module.exports = mongoose.model('UserProfile', userProfileSchema)