// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { runGemini } = require('./vertex');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/gemini', async (req, res) => {
    const prompt = req.body.prompt;

    try {
        const reply = await runGemini(prompt)
        res.json({ reply })
    } catch (error) {
        console.error('Error from Gemini API:', error.response || error.message);
        res.status(500).json({ error: 'Failed to fetch from Gemini API' });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Gemini backend server running on port ${process.env.PORT}`);
});
