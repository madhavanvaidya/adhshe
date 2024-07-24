const express = require('express');
const Discussion = require('../models/Discussions');
const router = express.Router();

router.post('/new', async (req, res) => {
    const { title, content } = req.body;
    const createdBy = req.session.userId; // Assuming userId is stored in session
  
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
      const discussions = await Discussion.find().populate('createdBy', 'firstname').sort({ createdAt: -1 }); // Fetch discussions sorted by creation date
      console.log('Discussions fetched:', discussions);
      res.json(discussions);
    } catch (err) {
      console.error('Error fetching discussions:', err);
      res.status(500).json({ message: 'Failed to fetch discussions' });
    }
  });

  router.get('/discussionDetails/:id', async (req, res) => {
    try {
      const discussion = await Discussion.findById(req.params.id)
        .populate('createdBy', 'firstname lastname')
        .populate({
          path: 'responses',
          populate: { path: 'user', select: 'firstname lastname' }
        });
  
      if (!discussion) {
        return res.status(404).send('Discussion not found');
      }
  
      // Assuming user information is stored in the session
      const firstname = req.session.firstname;
      const profileImage = req.session.profileImage;
  
      res.render('discussionDetails', {
        discussion,
        user: { firstname, profileImage }
      });
    } catch (err) {
      console.error('Failed to retrieve discussion details:', err);
      res.status(500).send('Server error: ' + err.message);
    }
  });

  // Add a new response to a discussion
router.post('/:id/responses', ensureAuthenticated, async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).send('Discussion not found');
    }

    const response = {
      text: req.body.text,
      user: req.session.userId // Assuming the user ID is stored in the session
    };

    discussion.responses.push(response);
    await discussion.save();

    res.redirect(`/api/discussions/discussionDetails/${discussion._id}`);
  } catch (err) {
    console.error('Failed to add response:', err);
    res.status(500).send('Server error: ' + err.message);
  }
});

function ensureAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  } else {
    res.redirect('/login');
  }
}
  
  module.exports = router;

  module.exports = router;