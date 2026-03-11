import type { ClassifiedPerson } from './merge.ts';

const HUB_URL = process.env.HUB_URL!;

export async function submitResults(classified: ClassifiedPerson[]): Promise<void> {
  const transportPeople = classified.filter(p => p.tags.includes('transport'));
  console.log(`  Osób z tagiem 'transport': ${transportPeople.length}`);

  const payload = {
    apikey: process.env.AI_DEVS_KEY,
    task: 'people',
    answer: transportPeople,
  };

  const res = await fetch(HUB_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const result = await res.json();
  console.log('Odpowiedź:', JSON.stringify(result, null, 2));
}
