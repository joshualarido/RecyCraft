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
    try {
        console.log("Sending prompt to Gemini API:", prompt); // Log the prompt being sent
        
        const result = await model.generateContent({
            contents: [
                {
                    role: 'user',
                    parts: [{ text: prompt }]
                }
            ]
        });

        console.log("Received response from Gemini API:", result.response); // Log response data
        return result.response;
    } catch (error) {
        console.error("Error during Gemini API request:", error); // Log complete error details
        throw error;  // Ensure the error is thrown for handling in the calling function
    }
}

module.exports = { runGemini }