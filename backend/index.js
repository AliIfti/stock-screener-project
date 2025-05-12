require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Allow CORS for all origins in production
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : 'http://localhost:3000'
}));

// Test route
app.get('/', (req, res) => {
  res.send('Stock Screener Backend is running.');
});

// Route to fetch stock data
app.get('/api/stock', async (req, res) => {
  const { symbol } = req.query;
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  console.log('Received request for symbol:', symbol);
  console.log('API Key present:', !!apiKey);

  if (!symbol) {
    console.log('Error: Symbol is required');
    return res.status(400).json({ error: 'Symbol is required' });
  }

  if (!apiKey) {
    console.log('Error: Missing API key');
    return res.status(500).json({ error: 'Missing API key' });
  }

  try {
    console.log('Making request to Alpha Vantage API...');
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        apikey: apiKey,
      },
    });

    console.log('API Response status:', response.status);
    console.log('API Response data:', JSON.stringify(response.data).slice(0, 200) + '...');

    if (response.data['Error Message']) {
      console.log('API Error:', response.data['Error Message']);
      return res.status(400).json({ error: 'Invalid symbol or API error' });
    }

    if (response.data['Note']) {
      console.log('API Note:', response.data['Note']);
      return res.status(429).json({ error: 'API rate limit exceeded' });
    }

    res.json(response.data);
  } catch (error) {
    console.error('API request failed:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    res.status(500).json({ error: 'Failed to fetch stock data', details: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Backend server is running on port ${PORT}`);
    console.log('Environment variables loaded:', {
        ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY ? 'Present' : 'Missing',
        NODE_ENV: process.env.NODE_ENV || 'development',
        FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
    });
});
