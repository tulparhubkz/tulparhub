import { test, expect } from '@playwright/test'

// Read-only smoke of the storefront money path at phone width. Nothing here
// writes to the DB or pings Telegram: forms are filled but never submitted,
// and the tracking probe uses an invoice number that cannot exist.

test('health endpoint reports db up', async ({ request }) => {
  const res = await request.get('/api/health')
  expect(res.status()).toBe(200)
  expect(await res.json()).toMatchObject({ ok: true, db: true })
})

test('home renders without horizontal overflow', async ({ page }) => {
  await page.goto('/ru')
  await expect(page.locator('h1')).toBeVisible()
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBe(0)
})

test('catalog shows product cards and search narrows them', async ({ page }) => {
  await page.goto('/ru/catalog')
  await expect(page.locator('.card').first()).toBeVisible({ timeout: 20_000 })

  await page.goto('/ru/catalog?q=' + encodeURIComponent('фильтр'))
  const first = page.locator('.card').first()
  await expect(first).toBeVisible({ timeout: 20_000 })
  await expect(first.locator('.card-name')).toContainText(/фильтр/i)
})

test('PDP opens from the catalog and adds to the cart', async ({ page }) => {
  await page.goto('/ru/catalog')
  const card = page.locator('.card').first()
  await expect(card).toBeVisible({ timeout: 20_000 })
  const cardName = (await card.locator('.card-name').textContent()) ?? ''

  await card.click()
  await expect(page).toHaveURL(/\/catalog\/.+/)
  await expect(page.locator('h1')).toContainText(cardName.slice(0, 12), { timeout: 20_000 })

  await page.getByRole('button', { name: /в корзину/i }).first().click()
  await expect(page.getByText('Добавлено в корзину')).toBeVisible()
})

test('cart shows the item and the checkout form (not submitted)', async ({ page }) => {
  // Seed the cart through the real PDP flow, then inspect the cart page.
  await page.goto('/ru/catalog')
  const card = page.locator('.card').first()
  await expect(card).toBeVisible({ timeout: 20_000 })
  await card.click()
  await page.getByRole('button', { name: /в корзину/i }).first().click()

  await page.goto('/ru/cart')
  await expect(page.locator('.cart-item')).toHaveCount(1)
  await expect(page.getByText('К оплате')).toBeVisible()
  // The submit button exists but is never clicked — this smoke stays read-only.
  await expect(page.getByRole('button', { name: /Сформировать счёт|Оплатить заказ/ })).toBeVisible()
})

test('order tracking politely rejects an unknown order', async ({ page }) => {
  await page.goto('/ru/track')
  await page.getByPlaceholder('TH-2026-123456').fill('TH-1900-000000') // year that never existed
  await page.getByPlaceholder('+7 700 000 00 00').fill('+7 (700) 000-00-99')
  await page.getByRole('button', { name: 'Отследить' }).click()
  await expect(page.getByText(/Заказ не найден/)).toBeVisible()
})
