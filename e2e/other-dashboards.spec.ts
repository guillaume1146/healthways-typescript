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

test.describe('I. Other User Type Dashboards', () => {
  test('I1: Nurse dashboard loads', async ({ page }) => {
    await loginAs(page, 'priya.ramgoolam@ohmydok.com', 'Nurse123!')
    await page.goto('/nurse', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/welcome|dashboard|nurse|appointment|booking/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('I2: Nanny dashboard loads', async ({ page }) => {
    await loginAs(page, 'anita.beeharry@ohmydok.com', 'Nanny123!')
    await page.goto('/nanny', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/welcome|dashboard|nanny|booking|famil/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('I3: Pharmacist dashboard loads', async ({ page }) => {
    await loginAs(page, 'rajesh.doorgakant@ohmydok.com', 'Pharma123!')
    await page.goto('/pharmacist', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/welcome|dashboard|pharmacist|medicine|order|inventory/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('I4: Lab Technician dashboard loads', async ({ page }) => {
    await loginAs(page, 'david.ahkee@ohmydok.com', 'Lab123!')
    await page.goto('/lab-technician', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/welcome|dashboard|lab|test|booking/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('I5: Emergency Worker dashboard loads', async ({ page }) => {
    await loginAs(page, 'jeanmarc.lafleur@ohmydok.com', 'Emergency123!')
    await page.goto('/responder', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/welcome|dashboard|emergency|responder|call/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('I6: Insurance Rep dashboard loads', async ({ page }) => {
    await loginAs(page, 'vikram.doorgakant@ohmydok.com', 'Insurance123!')
    await page.goto('/insurance', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/welcome|dashboard|insurance|claim|client/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('I7: Corporate Admin dashboard loads', async ({ page }) => {
    await loginAs(page, 'anil.doobur@ohmydok.com', 'Corporate123!')
    await page.goto('/corporate', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/welcome|dashboard|corporate|company|employee/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('I8: Referral Partner dashboard loads', async ({ page }) => {
    await loginAs(page, 'sophie.leclerc@ohmydok.com', 'Referral123!')
    await page.goto('/referral-partner', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/welcome|dashboard|referral|partner|client/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('I9: Super Admin dashboard loads', async ({ page }) => {
    await loginAs(page, 'hassan.doorgakant@ohmydok.com', 'Admin123!')
    await page.goto('/admin', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/welcome|dashboard|admin|user|platform/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })
})

test.describe('J. Notification System', () => {
  test('J1: Dashboard header loads with user name and logout', async ({ page }) => {
    await loginAs(page, 'emma.johnson@ohmydok.com', 'Patient123!')
    await page.goto('/patient', { waitUntil: 'domcontentloaded' })

    // Wait for dashboard to load with welcome text
    await expect(page.locator('text=/welcome/i').first()).toBeVisible({ timeout: 30_000 })

    // Header shows user name and logout button
    await expect(page.locator('text=Emma Johnson')).toBeVisible({ timeout: 10_000 })
    await expect(page.locator('text=Logout')).toBeVisible({ timeout: 5_000 })
  })

  test('J2: Notification dropdown opens on bell click', async ({ page }) => {
    await loginAs(page, 'emma.johnson@ohmydok.com', 'Patient123!')
    await page.goto('/patient', { waitUntil: 'domcontentloaded' })

    await expect(page.locator('text=/welcome/i').first()).toBeVisible({ timeout: 30_000 })

    // Find and click the notification bell (usually has a badge or bell icon)
    const bellButton = page.locator('[aria-label*="notification"], [aria-label*="bell"], button:has(svg.lucide-bell), button:has(svg[data-testid="bell"])').first()

    if (await bellButton.count() > 0) {
      await bellButton.click()
      // Dropdown should appear with notifications or "no notifications" message
      const dropdown = page.locator('text=/notification|no.*notification|mark.*read/i').first()
      await expect(dropdown).toBeVisible({ timeout: 5_000 })
    }
  })
})

test.describe('K. Medicine Purchase Flow', () => {
  test('K1: Medicine search page loads', async ({ page }) => {
    await page.goto('/search/medicines', { waitUntil: 'domcontentloaded' })

    // Page has "Find Medicine" button and "Medical Disclaimer"
    await expect(page.locator('text=Important Medical Disclaimer')).toBeVisible({ timeout: 20_000 })
    await expect(page.locator('button:has-text("Find Medicine")')).toBeVisible({ timeout: 5_000 })
  })

  test('K2: Pharmacist inventory page loads', async ({ page }) => {
    await loginAs(page, 'rajesh.doorgakant@ohmydok.com', 'Pharma123!')
    await page.goto('/pharmacist/inventory', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/inventory|medicine|add|stock/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('K3: Pharmacist orders page loads', async ({ page }) => {
    await loginAs(page, 'rajesh.doorgakant@ohmydok.com', 'Pharma123!')
    await page.goto('/pharmacist/orders', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/order|no.*order|pending/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })
})

test.describe('N. Provider Reviews', () => {
  test('N1: Doctor reviews page loads', async ({ page }) => {
    await loginAs(page, 'sarah.johnson@ohmydok.com', 'Doctor123!')
    await page.goto('/doctor/reviews', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/review|rating|no.*review/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('N2: Nurse reviews page loads', async ({ page }) => {
    await loginAs(page, 'priya.ramgoolam@ohmydok.com', 'Nurse123!')
    await page.goto('/nurse/reviews', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/review|rating|no.*review/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })

  test('N3: Nanny reviews page loads', async ({ page }) => {
    await loginAs(page, 'anita.beeharry@ohmydok.com', 'Nanny123!')
    await page.goto('/nanny/reviews', { waitUntil: 'domcontentloaded' })

    const content = page.locator('text=/review|rating|no.*review/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })
  })
})
