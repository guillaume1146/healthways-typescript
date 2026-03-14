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

test.describe('R. Regional Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'vikash.doorgakant@mediwyz.com', 'Regional123!')
  })

  test('R1: Regional admin feed/dashboard loads', async ({ page }) => {
    await page.goto('/regional/feed', { waitUntil: 'domcontentloaded' })
    const content = page.locator('text=/dashboard|regional|admin|welcome|overview/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('R2: Regional admin users page loads', async ({ page }) => {
    await page.goto('/regional/users', { waitUntil: 'domcontentloaded' })
    const content = page.locator('text=/user|manage|account|member/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('R3: Regional admin content page loads', async ({ page }) => {
    await page.goto('/regional/content', { waitUntil: 'domcontentloaded' })
    const content = page.locator('text=/content|landing|page|cms|edit/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('R4: Regional admin notifications page loads', async ({ page }) => {
    await page.goto('/regional/notifications', { waitUntil: 'domcontentloaded' })
    const content = page.locator('text=/notification|alert|message|update/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('R5: Regional admin security page loads', async ({ page }) => {
    await page.goto('/regional/security', { waitUntil: 'domcontentloaded' })
    const content = page.locator('text=/security|password|authentication|two.factor/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('R6: Regional admin profile page loads', async ({ page }) => {
    await page.goto('/regional/profile', { waitUntil: 'domcontentloaded' })
    const content = page.locator('text=/profile|account|personal|settings/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })
})
