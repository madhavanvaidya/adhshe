const mongoose = require('mongoose');

const HappinessSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    required: true
  },
  feelings: {
    type: [String],
    required: true
  },
  impact: {
    type: [String],
    required: true
  },
  additionalContext: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Happiness', HappinessSchema);
