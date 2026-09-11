const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    status: "USDT-Naira Exchange API is running",
    endpoints: ["/rate"]
  });
});

// Rate route - reads from Render Environment Variable
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
