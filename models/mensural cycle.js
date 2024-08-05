const mongoose = require('mongoose');

const MenstrualCycleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  startDate: { type: Date, required: true },
  cycleLength: { type: Number, required: true },
  symptoms: { type: [String], required: true }, // Array of symptoms
  mood: { type: String, required: true } // Mood field
});

module.exports = mongoose.model('MenstrualCycle', MenstrualCycleSchema);
