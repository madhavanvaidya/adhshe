require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const User = require('./models/User'); // Import User model

const app = express();
const session = require('express-session');

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Configure session middleware
app.use(session({
  secret: 'adhshe', // This secret key will encrypt your session cookie.
  resave: false,             // This means the session will be saved only if modified.
  saveUninitialized: false,  // This means no session will be saved for unauthenticated users.
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Ensures cookies are sent over HTTPS
    maxAge: 3600000 // Sets cookie expiry to one day
  }
}));
const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI; // Load MongoDB URI from .env file

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Add this line to handle form submissions

// Serve static files from the 'views' directory
app.use(express.static('views'));

// Routes
app.use('/api', userRoutes);

// MongoDB connection
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error: ', err));

// Middleware to check session
function checkSession(req, res, next) {
  if (req.session.userId) {
      res.redirect('/index');
  } else {
      res.redirect('/login');
  }
}

function ensureAuthenticated(req, res, next) {
  if (req.session.userId) {
      next(); // if a session exists, proceed to the next function in the middleware/route chain
  } else {
      res.redirect('/login'); // if no session, redirect to login page
  }
}

// Apply checkSession middleware to the root route
app.get('/', checkSession);

// Serve register.html on /register route
app.get('/register', (req, res) => {
    res.sendFile('auth-register-basic.html', { root: './views' });
});

// Define a basic route to render login.html
app.get('/login', (req, res) => {
  res.sendFile('auth-login-basic.html', { root: './views' });
});

app.get('/fp', (req, res) => {
    res.sendFile('auth-forgot-password-basic.html', { root: './views' });
});

app.get('/index', ensureAuthenticated, (req, res) => {
  // Assuming the username is stored in the session when the user logs in
  res.render('index', { username: req.session.username });
});

// POST route for user registration
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('<script>alert("User already exists"); window.location.href = "/login";</script>');
        }

        const newUser = new User({ username, email, password });
        const savedUser = await newUser.save();
        res.send('<script>alert("Registration successful"); window.location.href = "/login";</script>');
    } catch (err) {
        res.status(400).send('<script>alert("Registration failed"); window.location.href = "/register";</script>');
    }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          return res.redirect('/index');
      }
      res.clearCookie('connect.sid'); // depends on the name of your session cookie
      res.redirect('/login');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
