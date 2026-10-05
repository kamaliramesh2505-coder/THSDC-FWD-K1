const { GoogleGenerativeAI } = require('@google/generative-ai');

const callGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  if (!apiKey) {
    const error = new Error('Gemini API key is not configured');
    error.status = 503;
    throw error;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: modelName,
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text || !text.trim()) {
      const error = new Error('Gemini returned an empty response');
      error.status = 502;
      throw error;
    }

    return text.trim();
  } catch (error) {
    console.error('Gemini API Error:', error.message);

    if (error.status) {
      throw error;
    }

    const wrapped = new Error(
      `Gemini request failed: ${error.message || 'Unknown AI error'}`
    );
    wrapped.status = 502;
    throw wrapped;
  }
};

module.exports = {
  callGemini,
};
