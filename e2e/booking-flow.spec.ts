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

test.describe('F. Booking Flow', () => {
  test('F1: Search doctors page loads with doctor list', async ({ page }) => {
    await page.goto('/search/doctors', { waitUntil: 'domcontentloaded' })

    // Wait for stats to load (Verified Doctors count changes from 0)
    await expect(page.locator('text=Verified Doctors')).toBeVisible({ timeout: 15_000 })

    // Wait for doctor name cards to appear (e.g. "Dr. Sarah Johnson")
    const doctorName = page.locator('text=Dr. Sarah Johnson')
    await expect(doctorName).toBeVisible({ timeout: 45_000 })
  })

  test('F2: Doctor card has Book button', async ({ page }) => {
    await page.goto('/search/doctors', { waitUntil: 'domcontentloaded' })

    // Wait for doctor names to appear
    await expect(page.locator('text=Dr. Sarah Johnson')).toBeVisible({ timeout: 45_000 })

    // AuthBookingLink renders as <button>, not <a>
    const bookBtn = page.locator('button').filter({ hasText: /^Book$/ }).first()
    await bookBtn.scrollIntoViewIfNeeded()
    await expect(bookBtn).toBeVisible({ timeout: 10_000 })
  })

  test('F3: Patient can access booking form for a doctor', async ({ page }) => {
    await loginAs(page, 'emma.johnson@ohmydok.com', 'Patient123!')

    await page.goto('/search/doctors', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('text=Dr. Sarah Johnson')).toBeVisible({ timeout: 45_000 })

    // Click Book button (renders as <button> via AuthBookingLink)
    const bookBtn = page.locator('button').filter({ hasText: /^Book$/ }).first()
    await bookBtn.scrollIntoViewIfNeeded()
    await bookBtn.click()

    // Should navigate to booking page
    await page.waitForURL(/\/patient\/book\/doctor\//, { timeout: 15_000 })

    // Booking form should load
    const formContent = page.locator('text=/consultation|booking|appointment|select/i').first()
    await expect(formContent).toBeVisible({ timeout: 30_000 })
  })

  test('F4: Booking form has consultation type options', async ({ page }) => {
    await loginAs(page, 'emma.johnson@ohmydok.com', 'Patient123!')

    await page.goto('/search/doctors', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('text=Dr. Sarah Johnson')).toBeVisible({ timeout: 45_000 })

    const bookBtn = page.locator('button').filter({ hasText: /^Book$/ }).first()
    await bookBtn.scrollIntoViewIfNeeded()
    await bookBtn.click()
    await page.waitForURL(/\/patient\/book\/doctor\//, { timeout: 15_000 })

    // Wait for form to load — consultation type options
    const typeOption = page.locator('text=/in.person|video|home.visit/i').first()
    await expect(typeOption).toBeVisible({ timeout: 30_000 })
  })

  test('F5: Search nurses page loads with nurse list', async ({ page }) => {
    await page.goto('/search/nurses', { waitUntil: 'domcontentloaded' })

    // Wait for the stat cards and nurse names to appear
    await expect(page.locator('text=Verified Nurses')).toBeVisible({ timeout: 15_000 })
    await expect(page.locator('text=Priya Ramgoolam')).toBeVisible({ timeout: 30_000 })
  })

  test('F6: Search lab tests page loads with test catalog', async ({ page }) => {
    await page.goto('/search/lab', { waitUntil: 'domcontentloaded' })

    // Wait for page structure to render (stats + advisory + search form)
    await expect(page.locator('text=Medical Advisory')).toBeVisible({ timeout: 20_000 })
    await expect(page.locator('button:has-text("Find Tests")')).toBeVisible({ timeout: 5_000 })
  })

  test('F7: Doctor can see booking requests page', async ({ page }) => {
    await loginAs(page, 'sarah.johnson@ohmydok.com', 'Doctor123!')

    await page.goto('/doctor/booking-requests', { waitUntil: 'domcontentloaded' })

    const heading = page.locator('text=/booking request|pending/i').first()
    await expect(heading).toBeVisible({ timeout: 30_000 })
  })

  test('F8: Patient bookings page shows filter tabs', async ({ page }) => {
    await loginAs(page, 'emma.johnson@ohmydok.com', 'Patient123!')

    await page.goto('/patient/bookings', { waitUntil: 'domcontentloaded' })

    const heading = page.locator('text=My Bookings')
    await expect(heading).toBeVisible({ timeout: 30_000 })

    // Filter tabs
    await expect(page.locator('button[aria-label="All"]')).toBeVisible()
    await expect(page.locator('button[aria-label="Pending"]')).toBeVisible()
  })
})
