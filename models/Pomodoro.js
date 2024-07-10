const mongoose = require('mongoose');

const pomodoroSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workDuration: { type: Number, default: 25 }, // duration in minutes
  breakDuration: { type: Number, default: 5 },
  longBreakDuration: { type: Number, default: 15 },
  sessionsCompleted: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pomodoro', pomodoroSchema);
