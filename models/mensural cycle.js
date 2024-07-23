// models/MenstrualCycle.js
const mongoose = require('mongoose');

const MenstrualCycleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  startDate: { type: Date, required: true },
  cycleLength: { type: Number, required: true }
});

module.exports = mongoose.model('MenstrualCycle', MenstrualCycleSchema);
