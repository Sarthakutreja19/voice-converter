const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const SAPLING_API_URL = 'https://api.sapling.ai/api/v1/rephrase';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJZUEZsUW5fRmF2V0dHMHJxMF9oWFlUclhyTWdYLVZYQVladVUtQmxuZ1ZqMjBxSXphQS1Fdkp4V3FVNWcxT3I2RERyaTFtaC1JMUdoYXFVMFM2ZHhyQSUzRCUzRCIsImV4cCI6MTc1ODMwNzY2MH0.DR85Vf7pzJpezzY0JGMaq_yzswrTja4l-2oMkJIpkhI';

// Add GET route for testing
app.get('/api/rephrase', (req, res) => {
    res.json({ 
        message: 'Rephrase API is working! Use POST method with JSON body containing "text" field.',
        method: 'POST',
        url: '/api/rephrase',
        expectedBody: { text: 'Your text here' }
    });
});

app.post('/api/rephrase', async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        console.log('Input text:', text); // Debug log

        const response = await axios.post(SAPLING_API_URL, {
            text,
            mapping: 'active_to_passive',
            key: API_KEY
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://sapling.ai/'
            }
        });

        console.log('Sapling response:', JSON.stringify(response.data, null, 2)); // Debug log

        // Fix: Access the results array properly
        const results = response.data.results;
        
        if (!results || !Array.isArray(results) || results.length === 0) {
            return res.json({ 
                passiveText: null, 
                message: 'No conversion available for this text',
                originalText: text 
            });
        }

        // Get the first result's replacement
        const passiveText = results.replacement;
        
        if (!passiveText) {
            return res.json({ 
                passiveText: null,
                message: 'No passive form found for this text',
                originalText: text
            });
        }
        
        res.json({ 
            passiveText,
            originalText: text,
            success: true 
        });

    } catch (error) {
        console.error('Detailed error:', error.response?.data || error.message);
        
        res.status(500).json({ 
            error: 'Failed to convert text',
            details: error.response?.data || error.message,
            passiveText: null
        });
    }
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});

module.exports = app;
