'use strict';

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Import DB connection and routes
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolios');
const transactionRoutes = require('./routes/transactions');
const marketRoutes = require('./routes/market');
const alertRoutes = require('./routes/alerts');
const authDemoRoutes = require('./routes/authDemo');

// Error handling middlewares
const { errorHandler, notFound } = require('./middlewares/error');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Setup Session Management with MongoDB Store
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',  // Always use a strong session secret
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/finsight' }), // MongoDB URI from env
  cookie: {
    maxAge: 1000 * 60 * 60, // Session lasts for 1 hour
    secure: false, // Set to true if using HTTPS
    httpOnly: true
  }
}));

// Middleware setup
app.use(helmet());         // Security middleware
app.use(cors());           // Enable CORS
app.use(express.json());   // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(morgan('dev'));    // Logger

// Static file serving from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Set EJS as the view engine
app.set('views', path.join(__dirname, '..', 'views')); // Ensure the correct path
app.set('view engine', 'ejs');

// Simple home route
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.redirect('/demo/dashboard');
  } else {
    res.redirect('/demo/login');
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/alerts', alertRoutes);

// Demo Authentication Routes
app.use('/demo', authDemoRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to access the application`);
});

module.exports = app;