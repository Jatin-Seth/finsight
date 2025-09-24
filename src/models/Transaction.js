const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  portfolioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true },
  symbol: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ['BUY', 'SELL'], required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
