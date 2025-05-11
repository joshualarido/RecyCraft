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
        responseModalities:["TEXT","IMAGE"],
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
        parts: [{ text: prompt }],
      },
    ],
  });

  // Optional: Log full response for debugging
  const parts = result?.response?.candidates?.[0]?.content?.parts || [];
  console.log("Gemini parts:", JSON.stringify(parts, null, 2));

  // Try to find image data
  const imagePart = parts.find(
    (part) =>
      part.inlineData &&
      part.inlineData.mimeType &&
      part.inlineData.mimeType.startsWith("image/")
  );

  if (imagePart?.inlineData?.data) {
    return {
      type: "image",
      mimeType: imagePart.inlineData.mimeType,
      base64: imagePart.inlineData.data,
    };
  }

  // Fall back to text response
  return {
    type: "text",
    data: result.response,
  };
}


module.exports = { runGemini }