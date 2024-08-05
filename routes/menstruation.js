const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MenstrualCycle = require('../models/menstruation'); // Adjust the path as necessary

// GET all menstrual cycles
router.get('/', async (req, res) => {
  try {
    const cycles = await MenstrualCycle.find();
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
    userId: req.body.userId,
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
  if (req.body.userId != null) {
    res.cycle.userId = req.body.userId;
  }
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
router.delete('/:id', getMenstrualCycle, async (req, res) => {
  try {
    await res.cycle.remove();
    res.status(204).json({ message: 'Deleted Cycle' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

module.exports = router;
