const mongoose = require('mongoose')

const userActivitySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  description: String,
  timestamp: { type: Date, default: Date.now }
})

// Index for faster queries
userActivitySchema.index({ userId: 1, timestamp: -1 })

module.exports = mongoose.model('UserActivity', userActivitySchema)