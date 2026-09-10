# USDT Naira Exchange Website

A deployable Node.js + Express + SQLite website for selling USDT for Naira.

## Features
- Bold "BUY USDT" landing section with USDT logo.
- Admin-controlled USDT/NGN rate.
- Automatic Naira → USDT calculation.
- Customer USDT wallet field.
- Buy button creates an order.
- Payment bank/account details display after order creation.
- Admin dashboard for changing rate/payment account and managing order status.
- WhatsApp customer-care button uses the supplied number: 09167452777.

## Important setup
1. Set the `ADMIN_PASSWORD` environment variable on your hosting provider.
2. Change the default payment account in `/admin.html`.
3. Set your current USDT rate.
4. For production, use HTTPS and a strong admin password.
5. This starter records orders and displays payment details; it does NOT automatically verify bank transfers or send USDT on-chain. Those steps should be performed/verified securely before marking an order completed.

## Run locally
```bash
npm install
ADMIN_PASSWORD=your-secret-password npm start
```
Then open http://localhost:3000

## Deploy on Render
- Create a new Web Service from this project.
- Build command: `npm install`
- Start command: `npm start`
- Add environment variable: `ADMIN_PASSWORD` = your private admin password.

### SQLite note
Render's default filesystem is not a permanent database across all deployment/restart scenarios. For a real production exchange, use a persistent disk or a managed database such as PostgreSQL before relying on this for live orders.
