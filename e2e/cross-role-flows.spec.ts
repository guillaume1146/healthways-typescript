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

test.describe('S. Cross-Role Flows (Prescriptions & Lab Tests)', () => {
  test('S1: Doctor prescriptions page loads', async ({ page }) => {
    await loginAs(page, 'sarah.johnson@healthwyz.mu', 'Doctor123!')
    await page.goto('/doctor/prescriptions', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/prescription|medication|diagnosis/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('S2: Patient prescriptions page loads with data', async ({ page }) => {
    await loginAs(page, 'emma.johnson@healthwyz.mu', 'Patient123!')
    await page.goto('/patient/prescriptions', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/prescription|medication|diagnosis/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('S3: Lab technician results page loads', async ({ page }) => {
    await loginAs(page, 'david.ahkee@healthways.mu', 'Lab123!')
    await page.goto('/lab-technician/results', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/result|test|sample|lab/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('S4: Lab technician booking requests page loads', async ({ page }) => {
    await loginAs(page, 'david.ahkee@healthways.mu', 'Lab123!')
    await page.goto('/lab-technician/booking-requests', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/request|booking|test|pending/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('S5: Patient lab results page loads', async ({ page }) => {
    await loginAs(page, 'emma.johnson@healthwyz.mu', 'Patient123!')
    await page.goto('/patient/lab-results', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/lab|test|result|sample/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('S6: Pharmacist orders/prescriptions page loads', async ({ page }) => {
    await loginAs(page, 'rajesh.doorgakant@healthways.mu', 'Pharma123!')
    await page.goto('/pharmacist/orders', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/order|prescription|medicine|dispens/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })
})
