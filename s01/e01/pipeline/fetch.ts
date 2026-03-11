import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

const DATA_PATH = new URL('../data/people.csv', import.meta.url).pathname;

export async function fetchPeople(): Promise<void> {
  const apiKey = process.env.AI_DEVS_KEY;
  if (!apiKey) throw new Error('Brak AI_DEVS_KEY w pliku .env');

  const url = `https://hub.ag3nts.org/data/${apiKey}/people.csv`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

  const text = await res.text();
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  fs.writeFileSync(DATA_PATH, text, 'utf-8');

  const count = text.trim().split('\n').length - 1;
  console.log(`  Pobrano ${count} rekordów → data/people.csv`);
}
