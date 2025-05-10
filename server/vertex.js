const { VertexAI } = require('@google-cloud/vertexai')

const keyPath = './key.json'
process.env.GOOGLE_APPLICATION_CREDENTIALS = keyPath;

const vertexAI = new VertexAI({
    project: process.env.GOOGLE_PROJECT_ID,
    location: process.env.LOCATION
})

const model = vertexAI.getGenerativeModel({
    model: 'gemini-2.0-flash-001',
    generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
    }
})

async function runGemini(prompt) {
    const result = await model.generateContent({
        contents: [
            {
                role: 'user',
                parts: [{ text: prompt }]
            }
        ]
    })

    return result.response
}

module.exports = { runGemini }