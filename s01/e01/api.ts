import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: new URL('.env', import.meta.url).pathname });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function structuredChat(
  systemPrompt: string,
  userMessage: string,
  schema: OpenAI.Chat.ChatCompletionCreateParams['response_format'],
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    response_format: schema,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error('Brak odpowiedzi od modelu');
  return content;
}
