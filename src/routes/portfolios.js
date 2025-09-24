const express = require('express');
const Portfolio = require('../models/Portfolio');
const auth = require('../middlewares/auth');
const { computePortfolioSummary } = require('../controllers/valuation');
const router = express.Router();

router.use(auth);

// create
router.post('/', async (req, res, next) => {
  try {
    const { name, currency } = req.body;
    const p = new Portfolio({ ownerId: req.user.id, name, currency });
    await p.save();
    res.status(201).json(p);
  } catch (err) { next(err); }
});

// list
router.get('/', async (req, res, next) => {
  try {
    const list = await Portfolio.find({ ownerId: req.user.id });
    res.json(list);
  } catch (err) { next(err); }
});

// get by id
router.get('/:id', async (req, res, next) => {
  try {
    const p = await Portfolio.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Not found' });

    // Check ownership
    if (String(p.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(p);
  } catch (err) { next(err); }
});

// get portfolio summary with valuation
router.get('/:id/summary', async (req, res, next) => {
  try {
    const p = await Portfolio.findById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Portfolio not found' });

    // Check ownership
    if (String(p.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const summary = await computePortfolioSummary(req.params.id);

    res.json({
      portfolio: p,
      ...summary
    });
  } catch (err) { next(err); }
});

module.exports = router;