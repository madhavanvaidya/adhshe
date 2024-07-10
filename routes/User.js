const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if a user with the provided email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate password using bcrypt.compare
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Session creation using firstname
    req.session.userId = user._id;
    req.session.firstname = user.firstname;
    req.session.lastname = user.lastname;
    req.session.email = user.email;
    req.session.phone = user.phone;
    req.session.gender = user.gender;
    req.session.profileImage = user.profileImage;
    // If user and password are correct, redirect to index.html
    res.redirect('/index');
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/register', async (req, res) => {
  const { email, password, firstname, confirmPassword, lastname } = req.body;
  try {
      // Check if a user with the provided email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
      }

      // Check if password and confirm password are the same
      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create a new user with the hashed password
      const newUser = new User({ email, password: hashedPassword, firstname, lastname });
      const savedUser = await newUser.save();

      res.redirect('/login');
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Route to handle profile update
router.post('/update_profile', ensureAuthenticated, async (req, res) => {
  try {
    const { firstname, lastname, gender, phone } = req.body;
    const update = {
      firstname,
      lastname,
      gender,
      phone
    };

    const user = await User.findByIdAndUpdate(req.session.userId, update, { new: true });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Update session data
    req.session.firstname = user.firstname;
    req.session.lastname = user.lastname;
    req.session.gender = user.gender;
    req.session.phone = user.phone;
    req.session.pronouns = user.pronouns;

    console.log('Updated user:', user);

    res.redirect('/profile');
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).send('Error updating user profile');
  }
});

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Route to handle profile image upload
router.post('/upload_photo', ensureAuthenticated, upload.single('upload'), async (req, res) => {
  try {
    if (req.file) {
      const user = await User.findByIdAndUpdate(req.session.userId, { profileImage: req.file.path }, { new: true });

      if (!user) {
        return res.status(404).send('User not found');
      }

      // Update session data
      req.session.profileImage = user.profileImage;

      console.log('Updated user profile image:', user);
    }

    res.redirect('/profile');
  } catch (err) {
    console.error('Error updating profile image:', err);
    res.status(500).send('Error updating profile image');
  }
});

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  } else {
    res.redirect('/login');
  }
}


module.exports = router;
