const express = require('express');
const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const auth = require('../middlewares/auth');
const router = express.Router();

router.use(auth);

// record transaction
router.post('/:portfolioId', async (req, res, next) => {
  try {
    const { portfolioId } = req.params;
    const { symbol, qty, price, type } = req.body;
    const portfolio = await Portfolio.findById(portfolioId);
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });
    if (String(portfolio.ownerId) !== String(req.user.id)) return res.status(403).json({ error: 'Forbidden' });
    const t = new Transaction({ portfolioId, symbol: symbol.toUpperCase(), qty, price, type });
    await t.save();
    res.status(201).json(t);
  } catch (err) { next(err); }
});

module.exports = router;
