const express = require("express");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "change-this-password";

const db = new Database("exchange.db");
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    rate REAL NOT NULL DEFAULT 1500,
    bank_name TEXT NOT NULL DEFAULT 'Your Bank',
    account_name TEXT NOT NULL DEFAULT 'Your Business Name',
    account_number TEXT NOT NULL DEFAULT '0000000000',
    network TEXT NOT NULL DEFAULT 'TRC20',
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_ref TEXT UNIQUE NOT NULL,
    naira_amount REAL NOT NULL,
    usdt_amount REAL NOT NULL,
    wallet_address TEXT NOT NULL,
    rate REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'Awaiting Payment',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

db.prepare(`
  INSERT OR IGNORE INTO settings
  (id, rate, bank_name, account_name, account_number, network)
  VALUES (1, 1500, 'Your Bank', 'Your Business Name', '0000000000', 'TRC20')
`).run();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function getSettings() {
  return db.prepare("SELECT rate, bank_name, account_name, account_number, network, updated_at FROM settings WHERE id=1").get();
}

function auth(req, res, next) {
  const password = req.headers["x-admin-password"];
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.get("/api/settings", (req, res) => {
  res.json(getSettings());
});

app.post("/api/orders", (req, res) => {
  const { nairaAmount, walletAddress } = req.body;
  const naira = Number(nairaAmount);
  const wallet = String(walletAddress || "").trim();
  const settings = getSettings();

  if (!Number.isFinite(naira) || naira <= 0) {
    return res.status(400).json({ error: "Enter a valid Naira amount." });
  }
  if (!wallet || wallet.length < 10) {
    return res.status(400).json({ error: "Enter a valid USDT wallet address." });
  }

  const usdt = naira / settings.rate;
  const ref = "USDT-" + Date.now().toString(36).toUpperCase();

  db.prepare(`
    INSERT INTO orders (order_ref, naira_amount, usdt_amount, wallet_address, rate)
    VALUES (?, ?, ?, ?, ?)
  `).run(ref, naira, usdt, wallet, settings.rate);

  res.json({
    orderRef: ref,
    nairaAmount: naira,
    usdtAmount: Number(usdt.toFixed(6)),
    rate: settings.rate,
    payment: {
      bankName: settings.bank_name,
      accountName: settings.account_name,
      accountNumber: settings.account_number,
      network: settings.network
    }
  });
});

app.get("/api/admin/orders", auth, (req, res) => {
  const orders = db.prepare("SELECT * FROM orders ORDER BY id DESC LIMIT 200").all();
  res.json(orders);
});

app.get("/api/admin/settings", auth, (req, res) => {
  res.json(getSettings());
});

app.put("/api/admin/settings", auth, (req, res) => {
  const rate = Number(req.body.rate);
  const bankName = String(req.body.bankName || "").trim();
  const accountName = String(req.body.accountName || "").trim();
  const accountNumber = String(req.body.accountNumber || "").trim();
  const network = String(req.body.network || "TRC20").trim();

  if (!Number.isFinite(rate) || rate <= 0) {
    return res.status(400).json({ error: "Rate must be greater than zero." });
  }
  if (!bankName || !accountName || !accountNumber) {
    return res.status(400).json({ error: "Complete the payment account details." });
  }

  db.prepare(`
    UPDATE settings
    SET rate=?, bank_name=?, account_name=?, account_number=?, network=?, updated_at=CURRENT_TIMESTAMP
    WHERE id=1
  `).run(rate, bankName, accountName, accountNumber, network);

  res.json(getSettings());
});

app.patch("/api/admin/orders/:id", auth, (req, res) => {
  const allowed = ["Awaiting Payment", "Payment Received", "USDT Sent", "Completed", "Cancelled"];
  const status = String(req.body.status || "");
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Invalid status." });
  }
  db.prepare("UPDATE orders SET status=? WHERE id=?").run(status, req.params.id);
  res.json({ ok: true });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => console.log(`USDT exchange site running on port ${PORT}`));
