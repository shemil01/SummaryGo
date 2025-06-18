import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompt";
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export async function generateSummaryFromOpenAI(pdfText: string) {
  try {
    const compleation = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: SUMMARY_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Transform this document into an engaging, easy-to-read summary with contextually relevent emojis and proper markdown formatting:\n\n${pdfText}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    console.log(compleation.choices[0].message);
    return compleation.choices[0].message.content;
  } catch (error: any) {
    if (error.status === 429) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    throw error;
  }
}
