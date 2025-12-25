// backend/services/ai.service.js

import axios from "axios";

/**
 * 🚀 Universal AI Generator (like Gemini/OpenAI/OpenRouter)
 * Developer sends prompt → Your backend returns model output
 * No formatting rules forced — fully flexible.
 */
export async function generateAI(prompt, client) {
  try {
    const response = await axios.post(
      `${process.env.OLLAMA_BASE_URL}/api/generate`,
      {
        model: client.model, // client model from API key config
        prompt,
        stream: false
      },
      { timeout: 60000 }
    );

    return response.data.response?.trim();

  } catch (err) {
    console.error("❌ AI Error:", err.message);
    throw new Error("AI processing failed");
  }
}
