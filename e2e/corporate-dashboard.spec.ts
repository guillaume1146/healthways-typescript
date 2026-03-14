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

test.describe('Q. Corporate Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'anil.doobur@mediwyz.com', 'Corporate123!')
  })

  test('Q1: Corporate feed/dashboard loads with stats', async ({ page }) => {
    await page.goto('/corporate/feed', { waitUntil: 'domcontentloaded' })
    const content = page.locator('text=/dashboard|corporate|company|employee/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('Q2: Corporate employees page loads', async ({ page }) => {
    await page.goto('/corporate/employees', { waitUntil: 'domcontentloaded' })
    const content = page.locator('text=/employee|staff|team|member/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('Q3: Corporate claims page loads', async ({ page }) => {
    await page.goto('/corporate/claims', { waitUntil: 'domcontentloaded' })
    const content = page.locator('text=/claim|insurance|policy/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('Q4: Corporate profile page loads', async ({ page }) => {
    await page.goto('/corporate/profile', { waitUntil: 'domcontentloaded' })
    const content = page.locator('text=/profile|account|personal|settings/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })
})
