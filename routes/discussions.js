const express = require('express');
const Discussion = require('../models/Discussions');
const router = express.Router();

router.post('/new', async (req, res) => {
    const { title, content } = req.body;
    const createdBy = req.session.username; // Assuming userId is stored in session
  
    try {
      const newDiscussion = new Discussion({
        title,
        content,
        createdBy
      });
  
      savedDiscussion = await newDiscussion.save();
      res.redirect('/community');
    } catch (err) {
      console.error('Error creating discussion:', err);
      res.status(500).json({ message: 'Failed to create discussion' });
    }
  });

  router.get('/fetch', async (req, res) => {
    try {
      const discussions = await Discussion.find().populate('createdBy', 'username').sort({ createdAt: -1 }); // Fetch discussions sorted by creation date
      console.log('Discussions fetched:', discussions);
      res.json(discussions);
    } catch (err) {
      console.error('Error fetching discussions:', err);
      res.status(500).json({ message: 'Failed to fetch discussions' });
    }
  });

  module.exports = router;