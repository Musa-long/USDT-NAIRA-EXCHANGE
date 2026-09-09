const express = require("express");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
console.log("DEBUG: Admin password is:", ADMIN_PASSWORD)
const db = new Database("exchange.db");

db.exec("PRAGMA journal_mode = WAL");

// Create tables
db.exec(`
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    usdt_rate REAL NOT NULL DEFAULT 1500,
    bank_name TEXT NOT NULL DEFAULT 'Your Bank',
    business_name TEXT NOT NULL DEFAULT 'Your Business Name',
    account_number TEXT NOT NULL DEFAULT '0000',
    network TEXT NOT NULL DEFAULT 'TRC20',
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    customer_whatsapp TEXT NOT NULL,
    usdt_amount REAL NOT NULL,
    naira_amount REAL NOT NULL,
    wallet_address TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO settings (id) VALUES (1);
`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "Invalid password" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
