import { test, expect } from '@playwright/test'

test.describe('Search Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search/results')
  })

  test('renders the search page', async ({ page }) => {
    // The search page should have a heading
    const heading = page.locator('text=/search healthcare/i').first()
    await expect(heading).toBeVisible()
  })

  test('has a search input field', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]').first()
    await expect(searchInput).toBeVisible()
  })

  test('can type in the search box', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]').first()
    await searchInput.fill('Cardiology')
    await expect(searchInput).toHaveValue('Cardiology')
  })

  test('has a search submit button', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]').first()
    await expect(submitButton).toBeVisible()
  })

  test('can submit a search query', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]').first()
    await searchInput.fill('doctor')

    const submitButton = page.locator('button[type="submit"]').first()
    await submitButton.click()

    // URL should update with the search query
    await expect(page).toHaveURL(/q=doctor/i, { timeout: 5_000 })
  })

  test('displays a back to home link', async ({ page }) => {
    const backLink = page.locator('text=/back to home/i').first()
    await expect(backLink).toBeVisible()
  })

  test('navigating back to home works', async ({ page }) => {
    const backLink = page.locator('a[href="/"]').first()
    await backLink.click()
    await expect(page).toHaveURL('/')
  })

  test('search with query param pre-fills the input', async ({ page }) => {
    await page.goto('/search/results?q=Neurology')
    const searchInput = page.locator('input[placeholder*="Search"]').first()
    await expect(searchInput).toHaveValue('Neurology')
  })

  test('clear button appears when text is entered', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]').first()
    await searchInput.fill('test query')

    // A clear/times button should appear near the search input
    const clearButton = page.locator('input[placeholder*="Search"]').locator('..').locator('button').first()
    await expect(clearButton).toBeVisible()
  })
})
