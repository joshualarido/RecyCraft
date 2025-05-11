const { VertexAI } = require('@google-cloud/vertexai')
const { GoogleGenAI, Modality } = require("@google/genai")

const keyPath = './key.json'
process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;

const vertexAI = new VertexAI({
    project: process.env.GOOGLE_PROJECT_ID,
    location: process.env.LOCATION
})

const model = vertexAI.getGenerativeModel({
    model: 'gemini-2.0-flash-preview-image-generation',
    generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
    },
    responseMimeType: 'image/png',
})

async function runGemini(prompt) {
    const result = await model.generateContent({
        contents: [
            {
                role: 'user',
                parts: [{ text: prompt }]
            }
        ],
    })

    return result.response
}

module.exports = { runGemini }