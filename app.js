// Import required modules
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongodb-session')(session);
const bcrypt = require('bcrypt');
const User = require('./models/user');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/user-auth').then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

// Create the Express app
const app = express();

// Configure session middleware with MongoDB session store
const store = new MongoStore({
  uri: 'mongodb://127.0.0.1:27017/user-auth',
  collection: 'sessions'
});

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: store
}));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Parse request bodies
app.use(express.urlencoded({ extended: true }));

// Rest of the code...

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', async (req, res) => {
  const {email, username, password } = req.body;
  console.log(username,password);
  try {
    const user = await User.findOne({email});
    if(!user){
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({email, username, password: hashedPassword });
        await newUser.save();
        //creating session
        req.session.user = newUser;
        res.redirect('/dashboard');
    }
  } catch (error) {
    console.error('Error signing up:', error);
    res.redirect('/signup');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      // User login successful

      req.session.user = user; // Store user in session

      res.redirect('/dashboard');
    } else {
      // Invalid username or password
      res.redirect('/login');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.redirect('/login');
  }
});


app.get('/dashboard', (req, res) => {
  console.log(req.session.user);
  if (req.session.user) {
    res.render('dashboard', { username: req.session.user.username });
  } else {
    res.redirect('/login');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});