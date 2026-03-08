import { test, expect, Page } from '@playwright/test'

// Dashboard pages make many API calls — need more time
test.setTimeout(60_000)

async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login')
  const emailInput = page.locator('input[name="email"]')
  await expect(emailInput).toBeVisible({ timeout: 10_000 })
  await emailInput.fill(email)
  await page.locator('input[name="password"]').fill(password)
  await page.locator('button[type="submit"]').click()
  // Login API + redirect can be slow under load
  await page.waitForURL(
    /\/(patient|doctor|nurse|nanny|pharmacist|lab-technician|responder|insurance|corporate|referral-partner|regional|admin)\//,
    { timeout: 30_000 }
  )
}

test.describe('Patient Dashboard', () => {
  // Run serially to avoid overwhelming the server with concurrent dashboard loads
  test.describe.configure({ mode: 'serial' })

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'emma.johnson@healthwyz.mu', 'Patient123!')
  })

  test('E1: Overview page loads with welcome text and stat cards', async ({ page }) => {
    await page.goto('/patient', { waitUntil: 'domcontentloaded' })

    // Wait past the "Loading your dashboard..." spinner
    const welcomeText = page.locator('text=/welcome/i').first()
    await expect(welcomeText).toBeVisible({ timeout: 30_000 })

    // Verify at least one stat card
    const statCard = page.locator('text=/appointment|prescription|health record|checkup/i').first()
    await expect(statCard).toBeVisible({ timeout: 10_000 })
  })

  test('E2: Bookings page with filter tabs', async ({ page }) => {
    await page.goto('/patient/bookings', { waitUntil: 'domcontentloaded' })

    // Wait for the heading (past loading spinner)
    const heading = page.locator('text=My Bookings')
    await expect(heading).toBeVisible({ timeout: 30_000 })

    // Verify filter tab buttons (icon-only with aria-label)
    await expect(page.locator('button[aria-label="All"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Pending"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Upcoming"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Past"]')).toBeVisible()

    // Click Pending tab and verify active state
    await page.locator('button[aria-label="Pending"]').click()
    await expect(page.locator('button[aria-label="Pending"]')).toHaveClass(/bg-blue-600/)
  })

  test('E3: Consultations page loads', async ({ page }) => {
    await page.goto('/patient/consultations', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/consult|appointment|book|doctor/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('E4: Prescriptions page loads', async ({ page }) => {
    await page.goto('/patient/prescriptions', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/prescription|medication|medicine/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('E5: Health records page loads', async ({ page }) => {
    await page.goto('/patient/health-records', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/health record|medical record|record/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('E6: Lab results page loads', async ({ page }) => {
    await page.goto('/patient/lab-results', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/lab|test|result/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('E7: Profile page has pre-populated fields', async ({ page }) => {
    await page.goto('/patient/profile', { waitUntil: 'domcontentloaded' })

    // Wait for profile data to load (may take a while for API response)
    const nameText = page.locator('text=/Emma/i').first()
    await expect(nameText).toBeVisible({ timeout: 45_000 })
  })

  test('E8: Video call page loads', async ({ page }) => {
    await page.goto('/patient/video', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/video|call|room|consultation|upcoming/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('E9: Chat/Messages page loads', async ({ page }) => {
    await page.goto('/patient/chat', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/message|conversation|chat|search|connect/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })
})
