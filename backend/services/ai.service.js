import axios from "axios";

/**
 * Enhance text using local Ollama AI
 */
export async function enhanceText(text, client) {
  try {
    const response = await axios.post(
      `${process.env.OLLAMA_BASE_URL}/api/generate`,
      {
        model: client.model,
prompt: `You are a professional resume editor.
Return ONLY ONE single professional sentence.
Do NOT explain anything.
Do NOT repeat instructions.
Do NOT add headings, lists, or extra text.
Do NOT include quotation marks.
Make it ATS-friendly and concise.

CONTENT TO REWRITE:
${text}
`,
        stream: false
      },
      {
        timeout: 60000 // 60 seconds safety timeout
      }
    );

    return response.data.response.trim();
  } catch (error) {
    console.error("❌ Ollama AI error:", error.message);
    throw new Error("AI processing failed");
  }
}
