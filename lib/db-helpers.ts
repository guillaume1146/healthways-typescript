import prisma from '@/lib/db'

type ProfileModel =
  | 'doctorProfile'
  | 'nurseProfile'
  | 'nannyProfile'
  | 'pharmacistProfile'
  | 'labTechProfile'
  | 'emergencyWorkerProfile'

/**
 * Look up a provider profile by its own ID first, falling back to `userId`.
 *
 * Many booking API routes receive an ID that may be either the profile's
 * primary key *or* the related `User.id`. This helper encapsulates the
 * two-step lookup that was previously duplicated across every booking route.
 *
 * @param model  - The Prisma profile model name (e.g. `'nurseProfile'`).
 * @param id     - The ID to search for (could be profile ID or user ID).
 * @param select - Prisma `select` object; defaults to `{ id: true, userId: true }`.
 * @returns The matched profile record, or `null`.
 *
 * Example: const nurse = await findProfileByIdOrUserId('nurseProfile', nurseId)
 */
export async function findProfileByIdOrUserId(
  model: ProfileModel,
  id: string,
  select: Record<string, boolean> = { id: true, userId: true }
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prismaModel = (prisma as any)[model]

  let profile = await prismaModel.findUnique({ where: { id }, select })
  if (!profile) {
    profile = await prismaModel.findFirst({ where: { userId: id }, select })
  }
  return profile
}
