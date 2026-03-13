---
description: Run all tests and type checks to verify code quality
user-invocable: true
---

# Run Tests

Run the full test suite and type checks.

## Steps

1. Run `npx tsc --noEmit` to check for TypeScript errors
2. Run `npx vitest run` to execute all unit tests
3. If any tests fail:
   - Read the failing test file
   - Read the source file being tested
   - Identify the root cause
   - Fix the issue
   - Re-run only the failing test with `npx vitest run path/to/test.ts`
4. Report results: total tests, passed, failed, and any fixes applied
