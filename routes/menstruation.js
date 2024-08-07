const express = require('express');
const router = express.Router();
const MenstrualCycle = require('../models/menstruation'); 

// Middleware to get a menstrual cycle by ID
async function getMenstrualCycle(req, res, next) {
  let cycle;
  try {
    cycle = await MenstrualCycle.findById(req.params.id);
    if (cycle == null) {
      return res.status(404).json({ message: 'Cannot find cycle' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.cycle = cycle;
  next();
}

// GET all menstrual cycles and render the menstruation view
router.get('/', async (req, res) => {
  try {
    const userId = req.session.userId;
    const cycles = await MenstrualCycle.find({ userId });
    res.status(200).json(cycles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET a specific menstrual cycle by ID
router.get('/:id', getMenstrualCycle, (req, res) => {
  res.status(200).json(res.cycle);
});

// POST a new menstrual cycle
router.post('/', async (req, res) => {
  const cycle = new MenstrualCycle({
    userId: req.session.userId,
    startDate: req.body.startDate,
    cycleLength: req.body.cycleLength,
    symptoms: req.body.symptoms,
    mood: req.body.mood
  });

  try {
    const newCycle = await cycle.save();
    res.status(201).json(newCycle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH (update) a specific menstrual cycle by ID
router.patch('/:id', getMenstrualCycle, async (req, res) => {
  if (req.body.startDate != null) {
    res.cycle.startDate = req.body.startDate;
  }
  if (req.body.cycleLength != null) {
    res.cycle.cycleLength = req.body.cycleLength;
  }
  if (req.body.symptoms != null) {
    res.cycle.symptoms = req.body.symptoms;
  }
  if (req.body.mood != null) {
    res.cycle.mood = req.body.mood;
  }

  try {
    const updatedCycle = await res.cycle.save();
    res.status(200).json(updatedCycle);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a specific menstrual cycle by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await MenstrualCycle.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(200).json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
