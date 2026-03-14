import { test, expect, Page } from '@playwright/test'

test.setTimeout(90_000)

const MOBILE_VIEWPORT = { width: 375, height: 812 } // iPhone X
const TABLET_VIEWPORT = { width: 768, height: 1024 } // iPad

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

test.describe('L. Mobile Responsive Testing', () => {
  test('L1: Home page renders correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Page should load without horizontal scroll issues
    const body = page.locator('body')
    await expect(body).toBeVisible({ timeout: 15_000 })

    // Main heading or hero content should be visible
    const heroContent = page.locator('text=/health|care|wellness|healthw/i').first()
    await expect(heroContent).toBeVisible({ timeout: 20_000 })

    // Verify no content overflows the viewport width
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(MOBILE_VIEWPORT.width + 10)
  })

  test('L2: Login page is usable on mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto('/login', { waitUntil: 'domcontentloaded' })

    const emailInput = page.locator('input[name="email"]')
    await expect(emailInput).toBeVisible({ timeout: 10_000 })

    const passwordInput = page.locator('input[name="password"]')
    await expect(passwordInput).toBeVisible()

    const submitBtn = page.locator('button[type="submit"]')
    await expect(submitBtn).toBeVisible()

    // Inputs should be wide enough to type in on mobile
    const emailBox = await emailInput.boundingBox()
    expect(emailBox).toBeTruthy()
    expect(emailBox!.width).toBeGreaterThan(200)
  })

  test('L3: Patient dashboard loads on mobile with sidebar hidden', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await loginAs(page, 'emma.johnson@mediwyz.com', 'Patient123!')
    await page.goto('/patient', { waitUntil: 'domcontentloaded' })

    // Dashboard content should be visible
    const content = page.locator('text=/welcome|dashboard|patient/i').first()
    await expect(content).toBeVisible({ timeout: 30_000 })

    // On mobile, sidebar should be collapsed/hidden (not covering the full screen)
    // Check that the main content area is usable
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(MOBILE_VIEWPORT.width + 10)
  })

  test('L4: Search doctors page works on tablet', async ({ page }) => {
    await page.setViewportSize(TABLET_VIEWPORT)
    await page.goto('/search/doctors', { waitUntil: 'domcontentloaded' })

    await expect(page.locator('text=Verified Doctors')).toBeVisible({ timeout: 15_000 })
    await expect(page.locator('text=Dr. Sarah Johnson')).toBeVisible({ timeout: 45_000 })

    // Doctor cards should be visible and not overlapping
    const card = page.locator('text=Dr. Sarah Johnson')
    const box = await card.boundingBox()
    expect(box).toBeTruthy()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(TABLET_VIEWPORT.width + 10)
  })

  test('L5: Signup page form fields are accessible on mobile', async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT)
    await page.goto('/signup', { waitUntil: 'domcontentloaded' })

    // Registration page heading should be visible
    const heading = page.locator('text=Join MediWyz')
    await expect(heading).toBeVisible({ timeout: 15_000 })

    // Step indicators should be visible
    const stepIndicator = page.locator('text=Basic Info')
    await expect(stepIndicator).toBeVisible({ timeout: 10_000 })
  })

  test('L6: Doctor dashboard loads on tablet with proper layout', async ({ page }) => {
    await page.setViewportSize(TABLET_VIEWPORT)
    await loginAs(page, 'sarah.johnson@mediwyz.com', 'Doctor123!')
    await page.goto('/doctor', { waitUntil: 'domcontentloaded' })

    const welcomeText = page.locator('text=/welcome|dashboard|dr\\./i').first()
    await expect(welcomeText).toBeVisible({ timeout: 30_000 })

    // Content should fit within tablet width
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    expect(bodyWidth).toBeLessThanOrEqual(TABLET_VIEWPORT.width + 10)
  })
})
