---
description: Rules for writing API route handlers in app/api/
globs: app/api/**/*.ts
---

# API Route Conventions

## Response Format
Always use the standard response shape:
```typescript
{ success: true, data: T }
{ success: false, message: string }
```
Never use `{ error: "..." }` — always `{ success: false, message: "..." }`.

## Auth Pattern
Every non-public endpoint must:
1. Call `rateLimitPublic(request)` or `rateLimitAuth(request)` first
2. Call `validateRequest(request)` and check `if (!auth)`
3. Return `{ success: false, message: 'Unauthorized' }` with status 401

## Validation
- Use Zod schemas from `lib/validations/api.ts` — never inline validation
- Parse with `.safeParse(body)` and return `.issues[0].message` on failure
- Use `.min(1)` for string IDs, NOT `.uuid()` (seeded IDs are custom like PAT001)

## Error Handling
```typescript
} catch (error) {
  console.error('METHOD /api/route-name error:', error)
  return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
}
```
Never use `void error` to suppress — always log with `console.error`.

## Prisma Queries
- Use `select` (not `include`) to return only needed columns
- Import prisma from `@/lib/db` (default export)
