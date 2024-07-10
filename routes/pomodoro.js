// routes/pomodoro.js
const express = require('express');
const router = express.Router();
const Pomodoro = require('../models/Pomodoro');

// Ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.session.userId) {
    next(); // if a session exists, proceed to the next function in the middleware/route chain
  } else {
    res.redirect('/login'); // if no session, redirect to login page
  }
}

// Render Pomodoro page
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    // Fetch user settings if needed
    const settings = await Pomodoro.findOne({ userId: req.session.userId });
    res.render('pomodoro', {
      firstname: req.session.firstname,
      profileImage: req.session.profileImage,
      workDuration: settings ? settings.workDuration : 25,
      breakDuration: settings ? settings.breakDuration : 5,
      longBreakDuration: settings ? settings.longBreakDuration : 15
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
