import fs from 'fs';
import { structuredChat } from '../api.ts';
import { batchClassificationSchema } from '../schemas/classification.ts';
import type { TagResult } from '../schemas/classification.ts';
import type { Person } from '../types.ts';

const PROMPT_PATH = new URL('../prompts/classify-job.md', import.meta.url).pathname;

export async function classifyPeople(people: Person[]): Promise<TagResult[]> {
  const systemPrompt = fs.readFileSync(PROMPT_PATH, 'utf-8');

  const userMessage = people
    .map((p, i) => `[${i}] Opis pracy: ${p.job}`)
    .join('\n');

  console.log(`  Wysyłam ${people.length} opisów w 1 requeście...`);
  const content = await structuredChat(systemPrompt, userMessage, batchClassificationSchema);
  const { results } = JSON.parse(content) as { results: TagResult[] };

  return [...results].sort((a, b) => a.index - b.index);
}
