/**
 * Run as: node src/utils/sampleSeed.js
 * It will create a demo user and portfolio + an alert for testing
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Alert = require('../models/Alert');
const bcrypt = require('bcrypt');

async function seed() {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/finsight';
  await mongoose.connect(uri);
  console.log('connected');
  await User.deleteMany({});
  await Portfolio.deleteMany({});
  await Alert.deleteMany({});
  const hash = await bcrypt.hash('password123', 10);
  const user = new User({ email: 'demo@finsight.com', name: 'Demo User', passwordHash: hash });
  await user.save();
  const p = new Portfolio({ ownerId: user._id, name: 'Demo Portfolio' });
  await p.save();
  const a = new Alert({ userId: user._id, symbol: 'AAPL', condition: 'GT', price: 90 });
  await a.save();
  console.log('seeded', { userId: user._id, portfolioId: p._id });
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
