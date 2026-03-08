import { test, expect } from '@playwright/test'

test.describe('Search Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search/results')
  })

  test('renders the search page', async ({ page }) => {
    const heading = page.locator('text=/search healthcare/i').first()
    await expect(heading).toBeVisible()
  })

  test('has a search input field', async ({ page }) => {
    // Target the main form input (not the navbar autocomplete)
    const searchInput = page.locator('form input[placeholder*="Search doctors, nurses"]').first()
    await expect(searchInput).toBeVisible()
  })

  test('can type in the search box', async ({ page }) => {
    const searchInput = page.locator('form input[placeholder*="Search doctors, nurses"]').first()
    await searchInput.fill('Cardiology')
    await expect(searchInput).toHaveValue('Cardiology')
  })

  test('has a search submit button', async ({ page }) => {
    const form = page.locator('form').filter({ has: page.locator('input[placeholder*="Search doctors, nurses"]') })
    const submitButton = form.locator('button[type="submit"]').first()
    await expect(submitButton).toBeVisible()
  })

  test('can submit a search query', async ({ page }) => {
    const searchInput = page.locator('form input[placeholder*="Search doctors, nurses"]').first()
    await searchInput.fill('doctor')

    const form = page.locator('form').filter({ has: page.locator('input[placeholder*="Search doctors, nurses"]') })
    const submitButton = form.locator('button[type="submit"]').first()
    await submitButton.click()

    // URL updates via router.replace after form submit
    await expect(page).toHaveURL(/q=doctor/i, { timeout: 10_000 })
  })

  test('displays a back to home link', async ({ page }) => {
    const backLink = page.locator('text=/back to home/i').first()
    await expect(backLink).toBeVisible()
  })

  test('navigating back to home works', async ({ page }) => {
    const backLink = page.locator('a[href="/"]').filter({ hasText: /back to home|home/i }).first()
    await backLink.click()
    await expect(page).toHaveURL('/', { timeout: 10_000 })
  })

  test('search with query param pre-fills the input', async ({ page }) => {
    await page.goto('/search/results?q=Neurology')
    // Main form input should be pre-filled after Suspense hydration
    const searchInput = page.locator('form input[placeholder*="Search doctors, nurses"]').first()
    await expect(searchInput).toHaveValue('Neurology', { timeout: 10_000 })
  })

  test('clear button appears when text is entered', async ({ page }) => {
    const searchInput = page.locator('form input[placeholder*="Search doctors, nurses"]').first()
    await searchInput.fill('test query')

    // A clear button should appear inside the form near the input
    const form = page.locator('form').filter({ has: page.locator('input[placeholder*="Search doctors, nurses"]') })
    const clearButton = form.locator('button').filter({ hasNot: page.locator('[type="submit"]') }).first()
    await expect(clearButton).toBeVisible()
  })
})
