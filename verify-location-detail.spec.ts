import { test, expect } from '@playwright/test';

test.describe('Location Detail Population', () => {
  test('should show DIFFERENT data for different clicked blocks', async ({ page }) => {
    await page.goto('http://localhost:8080');

    // Wait for blocks to be generated
    await page.waitForTimeout(500);

    // Get first two different blocks
    const firstBlock = page.locator('.block').first();
    const secondBlock = page.locator('.block').nth(1);

    // Get data attributes from first block
    const firstName = await firstBlock.getAttribute('data-name');
    const firstType = await firstBlock.getAttribute('data-type');

    // Click first block
    await firstBlock.click();

    // Verify modal opens
    await expect(page.locator('#detailModal')).toHaveClass(/active/);

    // Get the modal content after first click
    const firstModalTitle = await page.locator('.modal-title').textContent();
    const firstDescription = await page.locator('.detail-section:nth-child(1) .detail-section-content').textContent();

    // The bug: modal should show data for firstName, but currently shows hardcoded data
    // This test will PASS currently (wrong!) because modal always shows same hardcoded data
    // After fix, this will verify modal updates correctly

    // Close modal
    await page.click('.modal-close');
    await expect(page.locator('#detailModal')).not.toHaveClass(/active/);

    // Get data attributes from second block
    const secondName = await secondBlock.getAttribute('data-name');
    const secondType = await secondBlock.getAttribute('data-type');

    // Click second block
    await secondBlock.click();

    // Verify modal opens again
    await expect(page.locator('#detailModal')).toHaveClass(/active/);

    // Get modal content after second click
    const secondModalTitle = await page.locator('.modal-title').textContent();
    const secondDescription = await page.locator('.detail-section:nth-child(1) .detail-section-content').textContent();

    // BUG TEST: Currently both clicks show same hardcoded data
    // After fix: title should match the clicked block's name
    if (firstName !== secondName) {
      // If blocks have different names, titles should be different
      // This WILL FAIL with current bug (both show "Location Details" or hardcoded name)
      expect(firstModalTitle).not.toBe(secondModalTitle);
      expect(firstModalTitle).toBe(firstName);
      expect(secondModalTitle).toBe(secondName);
    }
  });

  test('modal should show block-specific name as title', async ({ page }) => {
    await page.goto('http://localhost:8080');
    await page.waitForTimeout(500);

    // Get first block and its name
    const block = page.locator('.block').first();
    const expectedName = await block.getAttribute('data-name');

    // Click the block
    await block.click();

    // Verify modal appears
    await expect(page.locator('#detailModal')).toHaveClass(/active/);

    // BUG: Modal title should match the block's name
    // Currently shows hardcoded "Location Details" or doesn't update
    await expect(page.locator('.modal-title')).toHaveText(expectedName);
  });

  test('should close modal when close button is clicked', async ({ page }) => {
    await page.goto('http://localhost:8080');
    await page.waitForTimeout(500);

    const firstBlock = page.locator('.block').first();
    await firstBlock.click();
    await expect(page.locator('#detailModal')).toHaveClass(/active/);

    // Click close button
    await page.click('.modal-close');

    // Modal should not have active class
    await expect(page.locator('#detailModal')).not.toHaveClass(/active/);
  });
});
