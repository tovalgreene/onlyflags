const dotenv = require('dotenv'); // Import .env
dotenv.config(); // Load variables from .env

const express = require('express');
const exphbs = require('express-handlebars');
const passport = require('./config/passport-config');
const sequelize = require('./config/connection');
const routes = require('./controllers');
const path = require('path'); // For Node.js
const session = require('express-session'); // Express.js
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// const account = require('./models/account');
// const profile = require('./models/profile');
// const like = require('./models/like');

const app = express();
const PORT = process.env.PORT || 3000;

const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

// Set up middleware with a secret key
app.use(session(sess));

// Parse JSON & URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');


// Initialize passport.js
app.use(passport.initialize());
app.use(passport.session());

// Define routes
app.use(routes);

(async () => {
  try {
    await sequelize.sync({ force: false }); // Set force to true to drop and recreate the table
    console.log('like table synchronized with the database.');
  } catch (error) {
    console.error('Error synchronizing like table:', error);
  }

  // Start the server
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
})();
