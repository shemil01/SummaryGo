import axios from "axios";
export async function generateSummaryFromClaude(pdfText: string) {
  try {
    const response = await axios.post(
      'https://api.poe.com/bot/claude-3-sonnet/chat', // or 'claude-2'
      {
          content: `Transform this document into an engaging, easy-to-read summary with contextually relevent emojis and proper markdown formatting:\n\n${pdfText}`,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.POE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.response;
  } catch (error) {
    throw new Error(`Claude/Poe API error: ${error}`);
  }
}