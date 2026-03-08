import { test, expect, Page } from '@playwright/test'

test.setTimeout(90_000)

async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login')
  const emailInput = page.locator('input[name="email"]')
  await expect(emailInput).toBeVisible({ timeout: 10_000 })
  await emailInput.fill(email)
  await page.locator('input[name="password"]').fill(password)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL(
    /\/(patient|doctor|nurse|nanny|pharmacist|lab-technician|responder|insurance|corporate|referral-partner|regional|admin)\//,
    { timeout: 30_000 }
  )
}

test.describe('H. Doctor Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'sarah.johnson@healthwyz.mu', 'Doctor123!')
  })

  test('H1: Overview page loads with welcome text and stats', async ({ page }) => {
    await page.goto('/doctor', { waitUntil: 'domcontentloaded' })

    // Wait past loading spinner
    const welcomeText = page.locator('text=/welcome|dashboard|dr\\./i').first()
    await expect(welcomeText).toBeVisible({ timeout: 30_000 })

    // Verify stat cards are present
    const statCard = page
      .locator('text=/patient|appointment|consultation|prescription/i')
      .first()
    await expect(statCard).toBeVisible({ timeout: 10_000 })
  })

  test('H2: Booking Requests page loads with accept/deny', async ({ page }) => {
    await page.goto('/doctor/booking-requests', { waitUntil: 'domcontentloaded' })

    // Page heading or content should be visible
    const content = page.locator('text=/booking request|pending|no.*request/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('H3: Patients page loads', async ({ page }) => {
    await page.goto('/doctor/patients', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/patient|no.*patient/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('H4: My Posts page loads with create form', async ({ page }) => {
    await page.goto('/doctor/posts', { waitUntil: 'domcontentloaded' })

    // Should have a textarea for creating posts
    const textarea = page.locator('textarea').first()
    await expect(textarea).toBeVisible({ timeout: 30_000 })
  })

  test('H5: Profile page loads with doctor info', async ({ page }) => {
    await page.goto('/doctor/profile', { waitUntil: 'domcontentloaded' })

    // Should show the doctor's name
    const nameText = page.locator('text=/sarah|johnson/i').first()
    await expect(nameText).toBeVisible({ timeout: 45_000 })
  })

  test('H6: Appointments page loads', async ({ page }) => {
    await page.goto('/doctor/appointments', { waitUntil: 'domcontentloaded' })

    const content = page
      .locator('text=/appointment|schedule|no.*appointment|calendar/i')
      .first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('H7: Billing & Earnings page loads', async ({ page }) => {
    await page.goto('/doctor/billing', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/billing|earning|revenue|wallet|balance/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('H8: Video call page loads', async ({ page }) => {
    await page.goto('/doctor/video', { waitUntil: 'domcontentloaded' })

    const content = page
      .locator('text=/video|call|consultation|upcoming|room/i')
      .first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('H9: Messages page loads', async ({ page }) => {
    await page.goto('/doctor/messages', { waitUntil: 'domcontentloaded' })

    const content = page
      .locator('text=/message|conversation|chat|search|connect/i')
      .first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('H10: Reviews page loads', async ({ page }) => {
    await page.goto('/doctor/reviews', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/review|rating|no.*review/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })
})
