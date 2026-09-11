const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Connect to Neon Database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { 
    rejectUnauthorized: false 
  }
});

// Test DB connection on startup
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error connecting to DB', err.stack);
  }
  console.log('Connected to Neon Database ✅');
  release();
});

// ROUTE 1: Get latest USDT rate
app.get('/rate', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT rate, updated_at FROM rates ORDER BY updated_at DESC LIMIT 1'
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No rate found in database" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ROUTE 2: Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
---
