import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fetchPeople } from './pipeline/fetch.ts';
import { filterPeople } from './pipeline/filter.ts';
import { classifyPeople } from './pipeline/classify.ts';
import { mergePeopleWithTags } from './pipeline/merge.ts';
import { submitResults } from './pipeline/submit.ts';
import type { ClassifiedPerson } from './pipeline/merge.ts';

dotenv.config({ path: new URL('.env', import.meta.url).pathname });

const DATA_PATH = new URL('data/people.csv', import.meta.url).pathname;
const OUTPUTS_DIR = new URL('outputs', import.meta.url).pathname;

async function main(): Promise<void> {
  fs.mkdirSync(OUTPUTS_DIR, { recursive: true });

  console.log('Krok 1: Pobieranie danych...');
  await fetchPeople();

  console.log('Krok 2: Filtrowanie...');
  const filtered = filterPeople(DATA_PATH);
  console.log(`  Znaleziono ${filtered.length} osób`);

  console.log('Krok 3: Klasyfikacja...');
  const tagResults = await classifyPeople(filtered);

  console.log('Krok 4: Łączenie danych...');
  const classified: ClassifiedPerson[] = mergePeopleWithTags(filtered, tagResults);

  const outputPath = path.join(OUTPUTS_DIR, 'classified.json');
  fs.writeFileSync(outputPath, JSON.stringify(classified, null, 2), 'utf-8');
  console.log(`\nZapisano wyniki → outputs/classified.json`);

  console.log('Krok 5: Wysyłanie wyników...');
  await submitResults(classified);
}

main().catch(err => {
  console.error('Błąd:', (err as Error).message);
  process.exit(1);
});
