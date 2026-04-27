# 📈 Stock Tracker

A real-time stock price tracker with user accounts, watchlists, and live charts.

Built with React, Supabase, and Finnhub.

## Features

- 🔐 Sign up / sign in with email and password
- 📊 Live intraday price chart for selected stock
- ⭐ Personal watchlist — add and remove any stock
- 👤 Profile view with total portfolio overview
- 💾 Watchlist saved to database per user

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Charts:** Recharts
- **Database + Auth:** Supabase (PostgreSQL)
- **Stock Data:** Finnhub API

## Setup

See [GUIDE.md](./GUIDE.md) for the complete step-by-step setup instructions for beginners.

Quick version:
1. Get free API keys from [Finnhub](https://finnhub.io) and [Supabase](https://supabase.com)
2. Copy `.env.example` to `.env` and fill in your keys
3. Run `schema.sql` in your Supabase SQL editor
4. `npm install && npm run dev`
