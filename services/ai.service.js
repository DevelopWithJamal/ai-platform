import axios from "axios";

/**
 * Enhance text using local Ollama AI
 */
export async function enhanceText(text, client) {
  const response = await axios.post(
    "http://localhost:11434/api/generate",
    {
      model: client.model,
      prompt: `
You are a professional resume editor.
Rewrite the following text to be:
- Professional
- ATS-friendly
- Clear and concise
- No false information
Output ONLY the improved text.

Text:
${text}
`,
      stream: false
    },
    {
      timeout: 60000 // 60 seconds safety timeout
    }
  );

  return response.data.response.trim();
}

