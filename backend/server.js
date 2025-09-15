const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const SAPLING_API_URL = 'https://api.sapling.ai/api/v1/rephrase';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJZUEZsUW5fRmF2V0dHMHJxMF9oWFlUclhyTWdYLVZYQVladVUtQmxuZ1ZqMjBxSXphQS1Fdkp4V3FVNWcxT3I2RERyaTFtaC1JMUdoYXFVMFM2ZHhyQSUzRCUzRCIsImV4cCI6MTc1ODMwNzY2MH0.DR85Vf7pzJpezzY0JGMaq_yzswrTja4l-2oMkJIpkhI';

app.post('/api/rephrase', async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

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

        const passiveText = response.data.results[0]?.replacement;
        
        if (!passiveText) {
            throw new Error('No conversion result available');
        }

        res.json({ passiveText });
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Failed to convert text',
            details: error.response?.data || error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Backend server running on http://localhost:${port}`);
});