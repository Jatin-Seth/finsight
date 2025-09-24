const express = require('express');
const MarketPrice = require('../models/MarketPrice');
const router = express.Router();

// get latest price for symbol
router.get('/:symbol', async (req, res, next) => {
  try {
    const s = req.params.symbol.toUpperCase();
    const p = await MarketPrice.findOne({ symbol: s });
    if (!p) return res.status(404).json({ error: 'No price found for symbol' });
    res.json(p);
  } catch (err) { next(err); }
});

module.exports = router;
