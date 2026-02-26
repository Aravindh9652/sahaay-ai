const mongoose = require('mongoose')

const userProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  education: { type: mongoose.Schema.Types.Mixed, default: {} },
  market: { type: mongoose.Schema.Types.Mixed, default: {} },
  civic: { type: mongoose.Schema.Types.Mixed, default: {} },
  translate: {
    history: { type: [mongoose.Schema.Types.Mixed], default: [] }
  }
})

module.exports = mongoose.model('UserProgress', userProgressSchema)