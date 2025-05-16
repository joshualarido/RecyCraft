const fs = require('fs');
const path = require('path');
const { VertexAI } = require('@google-cloud/vertexai');
const { GoogleGenAI, Modality } = require("@google/genai");

let credentials;

// ✅ Step 1: Validate and parse KEY_JSON_BASE64
try {
  if (!process.env.KEY_JSON_BASE64) throw new Error('KEY_JSON_BASE64 not set');

  // Remove unexpected newlines (in case it was copied from a terminal)
  const base64Clean = process.env.KEY_JSON_BASE64.replace(/\n/g, '');
  const keyBuffer = Buffer.from(base64Clean, 'base64');
  credentials = JSON.parse(keyBuffer.toString('utf-8'));

  console.log("✅ Service account parsed successfully:", credentials);
} catch (err) {
  console.error("❌ Failed to parse service account credentials:", err.message);
  process.exit(1);
}

// ✅ Step 2: Validate project and location
if (!process.env.GOOGLE_PROJECT_ID || !process.env.LOCATION) {
  console.error("❌ Missing GOOGLE_PROJECT_ID or LOCATION environment variable.");
  process.exit(1);
}

console.log("✅ Loaded Vertex config:", {
  project: process.env.GOOGLE_PROJECT_ID,
  location: process.env.LOCATION,
});

// ✅ Step 3: Init VertexAI with credentials directly
const vertexAI = new VertexAI({
  project: process.env.GOOGLE_PROJECT_ID,
  location: process.env.LOCATION,
  credentials, // directly from parsed base64
});

// Optional: log models for debug
// vertexAI.listModels().then(m => console.log("✅ Available models", m)).catch(console.error);

const textModel = vertexAI.getGenerativeModel({
  model: 'gemini-2.5-flash-preview-04-17',
  generationConfig: {
    maxOutputTokens: 2048,
    temperature: 0.7,
  },
});

const imgModel = vertexAI.getGenerativeModel({
  model: 'gemini-2.0-flash-preview-image-generation',
  generationConfig: {
    responseModalities: ["TEXT", "IMAGE"],
    maxOutputTokens: 2048,
    temperature: 0.7,
  },
  responseMimeType: 'image/png',
});

// ✅ Gemini text + image helpers
async function textGemini(prompt, base64Image) {
  const contents = [
    {
      role: 'user',
      parts: [
        { text: prompt },
        base64Image && {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        },
      ].filter(Boolean),
    },
  ];

  const result = await textModel.generateContent({ contents });
  const parts = result.response.candidates[0].content.parts;
  const text = parts.find((p) => p.text)?.text || '';

  return { text };
}

async function imgGemini(prompt) {
  const result = await imgModel.generateContent({
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
  });

  const parts = result.response.candidates[0].content.parts;

  let base64Img = null;
  let mimeType = null;
  let text = null;

  for (const part of parts) {
    if (part.inlineData) {
      base64Img = part.inlineData.data;
      mimeType = part.inlineData.mimeType;
    } else if (part.text) {
      text = part.text;
    }
  }

  return {
    image: base64Img,
    mimeType,
    text,
  };
}

module.exports = { textGemini, imgGemini };
