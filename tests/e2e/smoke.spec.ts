import { expect, test } from '@playwright/test'

test('loads the playable Amberfall Farm vertical slice', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /restore a little hillside farm/i })).toBeVisible()
  await expect(page.getByLabel('Playable farm game canvas')).toBeVisible()
  await expect(page.getByText(/Move WASD\/Arrows/)).toBeVisible()
  await expect(page.locator('canvas')).toBeVisible()
})
