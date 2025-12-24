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
Rewrite the given text into ONE single professional sentence.
Rules:
- NO new lines
- NO bullet points
- NO headings
- NO lists
- NO extra information
- Preserve original meaning
- ATS-friendly
- Return ONE line only

Text:
${text}
`
            ,
            stream: false
        },
        {
            timeout: 60000 // 60 seconds safety timeout
        }
    );

    return response.data.response.trim();
}

