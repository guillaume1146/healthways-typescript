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

test.describe('P. Insurance Rep Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'vikram.doorgakant@mediwyz.com', 'Insurance123!')
  })

  test('P1: Insurance feed/dashboard loads', async ({ page }) => {
    await page.goto('/insurance/feed', { waitUntil: 'domcontentloaded' })
    const content = page.locator('text=/dashboard|insurance|policies|claims/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('P2: Insurance claims page loads', async ({ page }) => {
    await page.goto('/insurance/claims', { waitUntil: 'domcontentloaded' })
    const content = page.locator('text=/claims|insurance/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('P3: Insurance plans page loads', async ({ page }) => {
    await page.goto('/insurance/plans', { waitUntil: 'domcontentloaded' })
    const content = page.locator('text=/plans|insurance|policy/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('P4: Insurance clients page loads', async ({ page }) => {
    await page.goto('/insurance/clients', { waitUntil: 'domcontentloaded' })
    const content = page.locator('text=/client|patient|policy|holder|insurance|member/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('P5: Insurance profile page loads', async ({ page }) => {
    await page.goto('/insurance/profile', { waitUntil: 'domcontentloaded' })
    const content = page.locator('text=/profile|account|personal|settings/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })
})
