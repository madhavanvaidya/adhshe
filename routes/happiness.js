const express = require('express');
const router = express.Router();
const Happiness = require('../models/Happiness');

// Route to log a new happiness entry
router.post('/log', async (req, res) => {
  try {
    const { mood, feelings, impact, additionalContext } = req.body;
    const userId = req.session.userId; // Assuming session middleware sets userId

    const newEntry = new Happiness({
      userId,
      mood,
      feelings,
      impact,
      additionalContext,
      date: new Date()
    });

    await newEntry.save();
    res.json(newEntry); // Send the new entry back to the client
  } catch (error) {
    console.error('Error logging happiness entry:', error);
    res.status(500).json({ error: 'Failed to log happiness entry' });
  }
});

// Route to get all happiness entries for the logged-in user
router.get('/entries', async (req, res) => {
  try {
    const userId = req.session.userId; // Assuming session middleware sets userId
    const entries = await Happiness.find({ userId }).sort({ date: -1 }); // Sort entries by date descending
    res.json(entries);
  } catch (error) {
    console.error('Error fetching happiness entries:', error);
    res.status(500).json({ error: 'Failed to fetch happiness entries' });
  }
});

module.exports = router;