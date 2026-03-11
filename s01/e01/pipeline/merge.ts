import type { Person } from '../types.ts';
import type { TagResult, Tag } from '../schemas/classification.ts';

export interface ClassifiedPerson {
  name: string;
  surname: string;
  gender: 'M' | 'F';
  born: number;
  city: string;
  tags: Tag[];
}

export function mergePeopleWithTags(people: Person[], tagResults: TagResult[]): ClassifiedPerson[] {
  return tagResults.map(({ index, tags }) => {
    const person = people[index];
    if (!person) throw new Error(`Nieznany index: ${index}`);
    console.log(`  ${person.name} ${person.surname}: [${tags.join(', ') || 'brak tagów'}]`);
    return {
      name: person.name,
      surname: person.surname,
      gender: person.gender,
      born: new Date(person.birthDate).getFullYear(),
      city: person.birthPlace,
      tags,
    };
  });
}
