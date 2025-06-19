import axios from 'axios';

// Define your system prompt (similar to OpenAI's system message)
const SUMMARY_SYSTEM_PROMPT = "You are a helpful AI assistant that summarizes documents in an engaging, easy-to-read format with relevant emojis and proper markdown formatting.";

export async function generateSummaryFromCohere(pdfText: string) {
  try {
    const response = await axios.post(
      'https://api.cohere.ai/v1/summarize',
      {
        text: pdfText,
        model: 'command', // Cohere's best general-purpose model
        length: 'long', // 'short', 'medium', or 'long'
        format: 'paragraph', // 'paragraph' or 'bullets'
        extractiveness: 'low', // 'low', 'medium', 'high' (how much to copy from original)
        temperature: 0.7, // Similar to OpenAI's temperature
        additional_command: `${SUMMARY_SYSTEM_PROMPT}\n\nInclude relevant emojis and use markdown formatting.`
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    const summary = response.data.summary;
    return summary;
  } catch (error: any) {
    if (error.response?.status === 429) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    throw new Error(`Cohere API error: ${error.message}`);
  }
}