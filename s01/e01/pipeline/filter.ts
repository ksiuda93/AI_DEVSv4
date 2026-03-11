import fs from 'fs';
import type { Person, Filters } from '../types.ts';

export const FILTERS: Filters = {
  gender: 'M',
  ageRange: { min: 20, max: 40 },
  referenceYear: 2026,
  birthPlace: 'Grudziądz',
};

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

function parseCsv(filePath: string): Person[] {
  const lines = fs.readFileSync(filePath, 'utf-8').trim().split('\n');
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map(line => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ''])) as unknown as Person;
  });
}

function getAge(birthDate: string, referenceYear: number): number {
  return referenceYear - new Date(birthDate).getFullYear();
}

function matchesFilters(person: Person, filters: Filters): boolean {
  if (filters.gender && person.gender !== filters.gender) return false;

  if (filters.ageRange) {
    const age = getAge(person.birthDate, filters.referenceYear);
    if (age < filters.ageRange.min || age > filters.ageRange.max) return false;
  }

  if (filters.birthPlace) {
    if (person.birthPlace.toLowerCase() !== filters.birthPlace.toLowerCase()) return false;
  }

  if (filters.jobKeywords) {
    const jobLower = person.job.toLowerCase();
    if (!filters.jobKeywords.some(kw => jobLower.includes(kw.toLowerCase()))) return false;
  }

  return true;
}

export function filterPeople(csvPath: string): Person[] {
  const people = parseCsv(csvPath);
  return people.filter(p => matchesFilters(p, FILTERS));
}
