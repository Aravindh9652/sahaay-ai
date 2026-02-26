const mongoose = require('mongoose')

const userBookmarksSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  market: { type: [String], default: [] },
  education: { type: [String], default: [] },
  civic: { type: [String], default: [] }
})

module.exports = mongoose.model('UserBookmarks', userBookmarksSchema)