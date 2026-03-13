---
description: Add a new booking/consultation type with API, validation, and UI
user-invocable: true
---

# Add Booking Type

Add a new booking type to the platform (e.g., physiotherapist, psychologist).

## Arguments
$ARGUMENTS should contain: the provider type name and any specific fields needed.

## Steps

1. **Schema**: Add Prisma model in `prisma/schema.prisma` following existing booking patterns
2. **Validation**: Add Zod schema in `lib/validations/api.ts` extending `baseBookingSchema`
3. **API Route**: Create `app/api/bookings/{type}/route.ts` following the doctor booking pattern
4. **Update confirm route**: Add the new type to `bookingType` enum in `app/api/bookings/confirm/route.ts`
5. **Update resolve-booking**: Add case in `lib/bookings/resolve-booking.ts`
6. **Available slots**: Add provider type to `app/api/bookings/available-slots/route.ts`
7. **Patient booking page**: Create `app/patient/(dashboard)/book/{type}/[id]/page.tsx`
8. **Commission**: Update `lib/commission.ts` if pricing differs
9. **Seed data**: Add seed entries in `prisma/seeds/`
10. Run `npx tsc --noEmit` and `npx vitest run`
