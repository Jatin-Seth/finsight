const Transaction = require('../models/Transaction');
const MarketPrice = require('../models/MarketPrice');

// compute holdings and valuation for a portfolio
async function computePortfolioSummary(portfolioId) {
  // 1. Get all transactions for the portfolio
  const txns = await Transaction.find({ portfolioId });
  // aggregate by symbol
  const map = {};
  for (const t of txns) {
    const s = t.symbol;
    if (!map[s]) map[s] = { qty: 0, cost: 0, realized: 0 };
    if (t.type === 'BUY') {
      map[s].cost += t.qty * t.price;
      map[s].qty += t.qty;
    } else if (t.type === 'SELL') {
      // naive realized calculation: assume FIFO not implemented; simple reduction
      map[s].qty -= t.qty;
      map[s].realized += t.qty * t.price;
    }
  }
  // fetch latest prices
  const symbols = Object.keys(map);
  const prices = {};
  if (symbols.length) {
    const docs = await MarketPrice.find({ symbol: { $in: symbols } });
    for (const d of docs) prices[d.symbol] = d.price;
  }
  // build summary
  const holdings = [];
  let totalValue = 0;
  let totalCost = 0;
  for (const s of symbols) {
    const item = map[s];
    const market = prices[s] || 0;
    const value = (item.qty || 0) * market;
    const avgCost = item.qty ? (item.cost / (item.qty + (item.qty<0?0:0) || 1)) : 0;
    totalValue += value;
    totalCost += item.cost;
    holdings.push({
      symbol: s,
      quantity: item.qty,
      avgCost,
      marketPrice: market,
      marketValue: value,
      realized: item.realized
    });
  }
  return { holdings, totalValue, totalCost, unrealizedPL: totalValue - totalCost };
}

module.exports = { computePortfolioSummary };
