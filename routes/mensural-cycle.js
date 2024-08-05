const express = require('express');
const router = express.Router();
const MenstrualCycle = require('../models/MenstrualCycle');

// Ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Render Menstrual Cycle Tracker page
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const cycles = await MenstrualCycle.find({ userId: req.session.userId }).sort({ startDate: -1 });
    res.render('menstrualCycle', {
      firstname: req.session.firstname,
      profileImage: req.session.profileImage,
      cycles
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new cycle data
router.post('/', ensureAuthenticated, async (req, res) => {
  const { startDate, cycleLength, symptoms, mood } = req.body;
  const selectedSymptoms = symptoms ? symptoms : []; // Checkboxes will return an array

  const cycle = new MenstrualCycle({
    userId: req.session.userId,
    startDate: new Date(startDate),
    cycleLength: parseInt(cycleLength),
    symptoms: selectedSymptoms,
    mood: mood // Add mood to the cycle data
  });

  try {
    await cycle.save();
    res.redirect('/menstrualCycle');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
