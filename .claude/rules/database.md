---
description: Rules for Prisma and database operations
globs: "{prisma,lib/db,app/api}/**/*.{ts,prisma}"
---

# Database Conventions

## Prisma Client
- Import as default: `import prisma from '@/lib/db'`
- Use `select` over `include` to minimize data transfer
- Wrap multi-table operations in `prisma.$transaction()`

## Schema
- Single `User` table + 11 type-specific profile tables (1:1)
- Clinical relations reference profile IDs
- Cross-cutting relations (Video, Chat, Notification, Wallet) reference User IDs

## Seeds
- 13 modular seed files in `prisma/seeds/` (01 through 13)
- `prisma/seed.ts` orchestrates: clean + seed in dependency order
- Run: `npx prisma db seed`

## Migrations
- `npx prisma db push` for development
- `npx prisma migrate dev` for creating migrations
