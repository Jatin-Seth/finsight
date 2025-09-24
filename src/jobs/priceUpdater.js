require('dotenv').config();
const cron = require('node-cron');
const axios = require('axios');
const MarketPrice = require('../models/MarketPrice');
const Alert = require('../models/Alert');

// simple mock fetcher - replace with real provider if available
async function fetchPrice(symbol) {
  // For demo: random price around 100
  const price = +(80 + Math.random() * 40).toFixed(2);
  return { symbol: symbol.toUpperCase(), price, timestamp: new Date() };
}

async function updatePricesForSymbols(symbols) {
  const results = [];
  for (const s of symbols) {
    const p = await fetchPrice(s);
    const doc = await MarketPrice.findOneAndUpdate(
      { symbol: p.symbol },
      { price: p.price, timestamp: p.timestamp },
      { upsert: true, new: true }
    );
    results.push(doc);
  }
  return results;
}

async function checkAlerts() {
  const alerts = await Alert.find({ triggered: false });
  for (const a of alerts) {
    const mp = await MarketPrice.findOne({ symbol: a.symbol });
    if (!mp) continue;
    if (a.condition === 'GT' && mp.price > a.price) {
      a.triggered = true;
      await a.save();
      console.log('Alert triggered for', a.symbol, a.price);
    } else if (a.condition === 'LT' && mp.price < a.price) {
      a.triggered = true;
      await a.save();
      console.log('Alert triggered for', a.symbol, a.price);
    }
  }
}

async function runOnce() {
  // gather all symbols from alerts and transactions (simplified: use alerts only)
  const alerts = await Alert.find({});
  const symbols = Array.from(new Set(alerts.map(a => a.symbol)));
  if (!symbols.length) {
    console.log('No symbols to update');
    return;
  }
  await updatePricesForSymbols(symbols);
  await checkAlerts();
}

async function start() {
  // schedule based on env or default every minute
  const cronExp = process.env.PRICE_UPDATE_CRON || '*/1 * * * *';
  console.log('Starting price updater with cron:', cronExp);
  cron.schedule(cronExp, async () => {
    try {
      await runOnce();
    } catch (err) {
      console.error('Price updater error', err);
    }
  });
}

// run directly if executed
if (require.main === module) {
  const mongoose = require('mongoose');
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/finsight';
  mongoose.connect(uri).then(() => {
    console.log('Price updater connected to DB');
    start();
  }).catch(err => {
    console.error('Price updater DB connect failed', err);
  });
}

module.exports = { start, runOnce };
