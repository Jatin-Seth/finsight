const express = require('express');
const Alert = require('../models/Alert');
const auth = require('../middlewares/auth');
const router = express.Router();

router.use(auth);

router.post('/', async (req, res, next) => {
  try {
    const { symbol, condition, price } = req.body;
    const a = new Alert({ userId: req.user.id, symbol: symbol.toUpperCase(), condition, price });
    await a.save();
    res.status(201).json(a);
  } catch (err) { next(err); }
});

router.get('/', async (req, res, next) => {
  try {
    const list = await Alert.find({ userId: req.user.id });
    res.json(list);
  } catch (err) { next(err); }
});

module.exports = router;
