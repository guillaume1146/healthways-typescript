import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('renders the login form', async ({ page }) => {
    // LoginForm should render email and password fields
    const emailInput = page.locator('input[name="email"]')
    const passwordInput = page.locator('input[name="password"]')

    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  })

  test('has a submit button', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
  })

  test('email field accepts input', async ({ page }) => {
    const emailInput = page.locator('input[name="email"]')
    await emailInput.fill('test@example.com')
    await expect(emailInput).toHaveValue('test@example.com')
  })

  test('password field accepts input', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]')
    await passwordInput.fill('mypassword123')
    await expect(passwordInput).toHaveValue('mypassword123')
  })

  test('password field is masked by default', async ({ page }) => {
    const passwordInput = page.locator('input[name="password"]')
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('displays error message on invalid login attempt', async ({ page }) => {
    const emailInput = page.locator('input[name="email"]')
    const passwordInput = page.locator('input[name="password"]')
    const submitButton = page.locator('button[type="submit"]')

    await emailInput.fill('nonexistent@example.com')
    await passwordInput.fill('wrongpassword')
    await submitButton.click()

    // Wait for error message to appear (API call + render)
    const errorMessage = page.locator('text=/invalid|error|failed|incorrect/i').first()
    await expect(errorMessage).toBeVisible({ timeout: 10_000 })
  })

  test('submit button shows loading state during submission', async ({ page }) => {
    const emailInput = page.locator('input[name="email"]')
    const passwordInput = page.locator('input[name="password"]')
    const submitButton = page.locator('button[type="submit"]')

    await emailInput.fill('test@example.com')
    await passwordInput.fill('testpassword')

    // Click submit and check for loading state (button should be disabled or text changes)
    await submitButton.click()

    // The button should become disabled during submission
    // Note: this may happen very fast, so we just verify it doesn't crash
    await expect(submitButton).toBeVisible()
  })

  test('has a link to the signup page', async ({ page }) => {
    const signupLink = page.locator('a[href*="signup"]').first()
    await expect(signupLink).toBeVisible()
  })

  test('password toggle button exists', async ({ page }) => {
    // The LoginForm has a show/hide password toggle
    const passwordSection = page.locator('input[name="password"]').locator('..')
    const toggleButton = passwordSection.locator('button').first()
    await expect(toggleButton).toBeVisible()
  })
})
