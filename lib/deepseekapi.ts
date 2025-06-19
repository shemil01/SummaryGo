import { SUMMARY_SYSTEM_PROMPT } from '@/utils/prompt';
import axios from 'axios';
import OpenAI from "openai";
const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY
});
export async function generateSummaryFromDeepSeek(pdfText: string) {
  try {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "deepseek-chat",
  });

  console.log(completion.choices[0].message.content);
  return  completion.choices[0].message.content
  } catch (error) {
    throw new Error(`DeepSeek API error: ${error}`);
  }
}