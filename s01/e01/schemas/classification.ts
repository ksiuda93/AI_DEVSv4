export const TAGS = [
  'IT',
  'transport',
  'edukacja',
  'medycyna',
  'praca z ludźmi',
  'praca z pojazdami',
  'praca fizyczna',
] as const;

export type Tag = (typeof TAGS)[number];

export const classificationSchema = {
  type: 'json_schema' as const,
  json_schema: {
    name: 'job_classification',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        tags: {
          type: 'array',
          items: { type: 'string', enum: [...TAGS] as string[] },
          description: 'Lista tagów pasujących do opisu pracy',
        },
      },
      required: ['tags'],
      additionalProperties: false,
    },
  },
};

export interface TagResult {
  index: number;
  tags: Tag[];
}

export const batchClassificationSchema = {
  type: 'json_schema' as const,
  json_schema: {
    name: 'batch_job_classification',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              index: { type: 'integer' },
              tags: { type: 'array', items: { type: 'string', enum: [...TAGS] as string[] } },
            },
            required: ['index', 'tags'],
            additionalProperties: false,
          },
        },
      },
      required: ['results'],
      additionalProperties: false,
    },
  },
};
