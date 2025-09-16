// api/index.js
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS if needed
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Your rephrase route (adjust based on your actual logic)
app.post('/api/rephrase', (req, res) => {
  // Your existing rephrase logic here
  try {
    // Example response - replace with your actual logic
    res.json({ 
      success: true, 
      message: 'Rephrase endpoint working',
      data: req.body 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is working!' });
});

// Export for Vercel
module.exports = app;
