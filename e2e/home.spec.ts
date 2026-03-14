import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('loads successfully and has correct title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/MediWyz/i)
  })

  test('displays the main content area', async ({ page }) => {
    await page.goto('/')
    const main = page.locator('main#main-content')
    await expect(main).toBeVisible()
  })

  test('has a navigation bar', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })

  test('contains a link to the login page', async ({ page }) => {
    await page.goto('/')
    const loginLink = page.locator('a[href*="login"]').first()
    await expect(loginLink).toBeVisible()
  })

  test('navigates to the login page from the navbar', async ({ page }) => {
    await page.goto('/')
    const loginLink = page.locator('a[href*="login"]').first()
    await loginLink.click()
    await expect(page).toHaveURL(/.*login/)
  })

  test('contains a link to the signup page', async ({ page }) => {
    await page.goto('/')
    const signupLink = page.locator('a[href*="signup"]').first()
    await expect(signupLink).toBeVisible()
  })

  test('displays the stats section', async ({ page }) => {
    await page.goto('/')
    // The StatsSection component should render stat cards
    const statsSection = page.locator('text=/Qualified Doctors|Happy Patients|Consultations|Cities Covered/i').first()
    await expect(statsSection).toBeVisible({ timeout: 10_000 })
  })

  test('displays the services section', async ({ page }) => {
    await page.goto('/')
    // Look for the services section heading or content
    const servicesHeading = page.locator('text=/our services|what we offer/i').first()
    await expect(servicesHeading).toBeVisible({ timeout: 10_000 })
  })

  test('page has structured data (JSON-LD)', async ({ page }) => {
    await page.goto('/')
    const jsonLd = page.locator('script[type="application/ld+json"]')
    await expect(jsonLd).toBeAttached()

    const content = await jsonLd.textContent()
    const parsed = JSON.parse(content || '{}')
    expect(parsed['@type']).toBe('MedicalOrganization')
    expect(parsed.name).toBe('MediWyz')
  })

  test('has a footer on the home page', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
  })
})
