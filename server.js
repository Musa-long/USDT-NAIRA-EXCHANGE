const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Serve all files in /public folder
app.use(express.static(path.join(__dirname, 'public')));

// API Route
app.get('/rate', (req, res) => {
  try {
    const rate = parseFloat(process.env.RATE);
    if (!rate || isNaN(rate)) {
      return res.status(500).json({ error: "RATE not set in environment variables" });
    }
    res.json({ rate: rate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// If someone visits /, send index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
