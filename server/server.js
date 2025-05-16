// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { textGemini, imgGemini } = require('./vertex');
const fs = require('fs');
const path = require('path');

if (process.env.KEY_JSON_BASE64) {
  const keyBuffer = Buffer.from(process.env.KEY_JSON_BASE64, 'base64');
  fs.writeFileSync(path.join(__dirname, 'key.json'), keyBuffer);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.post(`${process.env.RAILWAY_LINK}/gemini/text`, async (req, res) => {
    const prompt = req.body.prompt;
    const image = req.body.image;

    try {
        const reply = await textGemini(prompt, image)
        res.json({ reply })
    } catch (error) {
        console.error('Error from Text Gemini API:', error.response || error.message);
        res.status(500).json({ error: 'Failed to fetch from Gemini API' });
    }
});

app.post(`${process.env.RAILWAY_LINK}/gemini/image`, async (req, res) => {
    const prompt = req.body.prompt;

    try {
        const reply = await imgGemini(prompt)
        res.json({ reply })
    } catch (error) {
        console.error('Error from Image Gemini API:', error.response || error.message);
        res.status(500).json({ error: 'Failed to fetch from Gemini API' });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Gemini backend server running on port ${process.env.PORT}`);
});
