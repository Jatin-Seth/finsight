# Finsight - Backend (Node.js + Express + MongoDB)

This repository contains the backend for **Finsight** — a trading & portfolio management platform built for the Backend Engineering-II evaluation.

## What you'll find
- Express REST APIs for auth, portfolios, transactions, market prices, and alerts.
- MongoDB (Mongoose) models for core entities.
- Background job (cron) to update market prices and trigger alerts.
- Simple EJS page to demo portfolio summary.
- Postman collection for testing endpoints.

## Quick setup

1. Install dependencies:
```
npm install
```

2. Copy `.env.example` to `.env` and update the variables:
```
cp .env.example .env
# edit .env
```

3. Run MongoDB locally (or provide MONGO_URI to a cloud MongoDB).

4. Start the server:
```
npm run dev
# or
npm start
```

5. Run the background worker (price updater):
```
npm run worker
```

## Demo data seeding
You can add a seed script or create users via API. A Postman collection is included at `postman_collection.json`.

## Project structure (important files)
- `src/app.js` — application entry
- `src/config/db.js` — MongoDB connection
- `src/models/*` — Mongoose models
- `src/routes/*` — Express routes
- `src/controllers/*` — controller logic
- `src/middlewares/*` — auth & error handling
- `src/jobs/priceUpdater.js` — cron job to update prices & trigger alerts
- `views/` — EJS templates for demo

## Key endpoints (quick)
- `POST /api/auth/register` — register
- `POST /api/auth/login` — login (get JWT)
- `POST /api/portfolios` — create portfolio
- `POST /api/portfolios/:id/transactions` — create transaction (BUY/SELL)
- `GET /api/portfolios/:id/summary` — portfolio summary (value, P&L)
- `POST /api/alerts` — create price alert

See Postman collection for full examples.

