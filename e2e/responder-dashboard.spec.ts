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

test.describe('O. Emergency Responder Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'jeanmarc.lafleur@ohmydok.com', 'Emergency123!')
  })

  test('O1: Responder feed/dashboard loads', async ({ page }) => {
    await page.goto('/responder/feed', { waitUntil: 'domcontentloaded' })
    const content = page.locator('text=/dashboard|responder|emergency|service/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('O2: Responder calls/history page loads', async ({ page }) => {
    await page.goto('/responder/calls', { waitUntil: 'domcontentloaded' })
    const content = page.locator('text=/call|history|incident|emergency/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('O3: Responder booking requests page loads', async ({ page }) => {
    await page.goto('/responder/booking-requests', { waitUntil: 'domcontentloaded' })
    const content = page.locator('text=/request|booking|incoming|emergency/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('O4: Responder services page loads', async ({ page }) => {
    await page.goto('/responder/services', { waitUntil: 'domcontentloaded' })
    const content = page.locator('text=/service|emergency|coverage|response/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('O5: Responder profile page loads', async ({ page }) => {
    await page.goto('/responder/profile', { waitUntil: 'domcontentloaded' })
    const content = page.locator('text=/profile|settings|account|personal/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })
})
