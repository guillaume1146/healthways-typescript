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

test.describe('O. Super Admin Role Configuration', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'hassan.doorgakant@healthways.mu', 'Admin123!')
  })

  test('O1: Role config page loads with feature table', async ({ page }) => {
    await page.goto('/admin/role-config', { waitUntil: 'domcontentloaded' })

    // Page heading
    const heading = page.locator('text=Role Feature Configuration')
    await expect(heading).toBeVisible({ timeout: 30_000 })

    // Save button exists
    await expect(page.locator('text=Save Changes')).toBeVisible({ timeout: 5_000 })

    // Feature table should have rows
    const tableRows = page.locator('table tbody tr')
    const rowCount = await tableRows.count()
    expect(rowCount).toBeGreaterThan(0)
  })

  test('O2: Admin users page loads with user list', async ({ page }) => {
    await page.goto('/admin/users', { waitUntil: 'domcontentloaded' })

    const heading = page.locator('text=User Management')
    await expect(heading).toBeVisible({ timeout: 30_000 })

    // Search input should be present
    const searchInput = page.locator('input[placeholder*="Search by name"]')
    await expect(searchInput).toBeVisible({ timeout: 10_000 })

    // Wait for table rows to load (async fetch)
    const firstRow = page.locator('table tbody tr').first()
    await expect(firstRow).toBeVisible({ timeout: 30_000 })
  })

  test('O3: Admin commission config page loads', async ({ page }) => {
    await page.goto('/admin/commission-config', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/commission|config|platform|rate/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('O4: Admin regional admins page loads', async ({ page }) => {
    await page.goto('/admin/regional-admins', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/regional|admin/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('O5: Admin security page loads', async ({ page }) => {
    await page.goto('/admin/security', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/security|log|audit|access/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })
})
