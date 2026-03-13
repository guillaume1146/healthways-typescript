---
description: Rules for writing tests
globs: "**/*.test.ts"
---

# Testing Conventions

## Framework
- Unit tests: Vitest (`npx vitest run`)
- E2E tests: Playwright (`npx playwright test`)

## Validation Tests
- Test with both UUID and custom IDs (PAT001, DOC001) — both must work
- Zod errors use `.issues[0].message` not `.errors[0].message`

## API Tests
- Mock Prisma with `vi.mock('@/lib/db')`
- Mock auth with `vi.mock('@/lib/auth/validate')`
- Always test: valid input, missing fields, invalid types, unauthorized access

## Run Commands
```bash
npx vitest run                    # All unit tests
npx vitest run path/to/test.ts   # Single file
npx tsc --noEmit                  # Type check (run before commit)
```
