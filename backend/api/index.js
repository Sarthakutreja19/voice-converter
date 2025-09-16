const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const SAPLING_API_URL = 'https://api.sapling.ai/api/v1/rephrase';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJZUEZsUW5fRmF2V0dHMHJxMF9oWFlUclhyTWdYLVZYQVladVUtQmxuZ1ZqMjBxSXphQS1Fdkp4V3FVNWcxT3I2RERyaTFtaC1JMUdoYXFVMFM2ZHhyQSUzRCUzRCIsImV4cCI6MTc1ODMwNzY2MH0.DR85Vf7pzJpezzY0JGMaq_yzswrTja4l-2oMkJIpkhI';

// GET route for testing
app.get('/api/rephrase', (req, res) => {
    res.json({ 
        message: 'Rephrase API is working! Use POST method with JSON body containing "text" field.',
        availableMappings: ['active_to_passive', 'passive_to_active', 'informal_to_formal', 'paraphrase']
    });
});

app.post('/api/rephrase', async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        console.log('Input text:', text);

        const requestData = {
            text: text.trim(),
            mapping: 'active_to_passive',
            key: API_KEY
        };

        console.log(' Request to Sapling:', requestData);

        const response = await axios.post(SAPLING_API_URL, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://sapling.ai/'
            }
        });

        console.log(' Raw Sapling response:', JSON.stringify(response.data, null, 2));
        console.log(' Response status:', response.status);

        // Parse the response properly
        const { results } = response.data;
        
        if (!results) {
            console.log(' No results field in response');
            return res.json({ 
                passiveText: null, 
                message: 'API returned no results field',
                rawResponse: response.data
            });
        }

        if (!Array.isArray(results)) {
            console.log(' Results is not an array:', typeof results);
            return res.json({ 
                passiveText: null, 
                message: 'API results is not an array',
                rawResponse: response.data
            });
        }

        if (results.length === 0) {
            console.log(' Results array is empty');
            return res.json({ 
                passiveText: null, 
                message: 'No conversion suggestions available for this text',
                originalText: text
            });
        }

        console.log(' First result:', results);

        // Get the replacement from first result
        const passiveText = results?.replacement;
        
        if (!passiveText) {
            console.log(' No replacement in first result');
            return res.json({ 
                passiveText: null,
                message: 'No passive conversion found',
                originalText: text,
                rawResult: results
            });
        }

        console.log(' Success! Passive text:', passiveText);
        
        res.json({ 
            passiveText,
            originalText: text,
            success: true,
            resultCount: results.length
        });

    } catch (error) {
        console.error(' Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
        });
        
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
