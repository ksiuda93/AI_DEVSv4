export interface Person {
  name: string;
  surname: string;
  gender: 'M' | 'F';
  birthDate: string;
  birthPlace: string;
  birthCountry: string;
  job: string;
}

export interface Filters {
  gender?: 'M' | 'F';
  ageRange?: { min: number; max: number };
  referenceYear: number;
  birthPlace?: string;
  jobKeywords?: string[];
}
