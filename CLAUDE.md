# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Solutions to [AI Devs v4](https://github.com/ksiuda93/AI_DEVSv4) — a Polish AI programming challenge course. Each season (`s01`, `s02`, ...) contains exercises (`e01`, `e02`, ...) with their own data and scripts.

## Environment

- Node.js 24 (see `.nvmrc`); use `nvm use` to activate
- TypeScript via `--experimental-strip-types` (no build step)
- CommonJS modules (`"type": "commonjs"` in `package.json`)
- Secrets go in `.env` (gitignored) — never commit them

## Structure

```
s<season>/e<exercise>/
  data/          # input data files (CSV, JSON, etc.)
  outputs/       # generated results (gitignored)
  pipeline/      # processing steps (fetch, filter, classify, merge, submit, ...)
  prompts/       # LLM system prompts (Markdown)
  schemas/       # Zod / JSON Schema definitions
  api.ts         # OpenAI client wrapper (structuredChat)
  types.ts       # shared TypeScript types
  app.ts         # pipeline orchestrator — entry point
```

## Running solutions

```bash
node --experimental-strip-types s01/e01/app.ts
```

## Pipeline pattern (s01/e01)

Each exercise follows a step-based pipeline in `app.ts`:

| Krok | Plik                    | Wejście → Wyjście                         |
|------|-------------------------|-------------------------------------------|
| 1    | `pipeline/fetch.ts`     | — → `data/people.csv`                     |
| 2    | `pipeline/filter.ts`    | CSV → `Person[]`                          |
| 3    | `pipeline/classify.ts`  | `Person[]` → `TagResult[]` (1 API call)   |
| 4    | `pipeline/merge.ts`     | `Person[]` + `TagResult[]` → `ClassifiedPerson[]` |
| 5    | `pipeline/submit.ts`    | `ClassifiedPerson[]` → POST `/verify`     |

## Conventions

- One API call per classification step (batch all inputs in a single request)
- `AI_DEVS_KEY` from `.env` used for submission to `https://hub.ag3nts.org/verify`
- Submission payload: `{ apikey, task, answer: <filtered results> }`
- `outputs/` is gitignored — never commit generated JSON
