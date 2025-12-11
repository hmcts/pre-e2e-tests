import { Page, Locator, expect } from '@playwright/test';

export class UserInterfaceUtils {
  constructor(public readonly page: Page) {}
  /**
   * Hides the specified element(s) by setting their visibility to 'hidden'.
   * This is useful for visual testing where you want to hide certain elements.
   * Playwright does offer support for masking elements during visual testing,
   * but this method provides a simple way to hide elements which can overlap modals etc... during masking.
   * Use of this method should be limited to scenarios where masking is not sufficient or applicable.
   * Verifies if the element is visible before hiding it.
   * Verifies that the element is hidden after applying the style.
   * @param elementToHide - The element or array of elements to hide.
   */
  public async hideElements(elementToHide: Locator | Locator[]) {
    const elements = Array.isArray(elementToHide) ? elementToHide : [elementToHide];

    for (const el of elements) {
      await expect(el.count()).resolves.toBeGreaterThan(0);
      const countOfElements = await el.count();
      for (let i = 0; i < countOfElements; i++) {
        await expect(el.nth(i)).toBeVisible();
        await el.nth(i).evaluate((node) => {
          node.style.visibility = 'hidden';
        });
        await expect(el.nth(i)).toBeHidden();
      }
    }
  }

  /**
   * Replaces dynamic text using specified string or regex to identify what needs replacing with an alternative string provided.
   * This is useful for visual testing where you want to ensure dynamic information is not visible in screenshots.
   * Verifies that the locator is a <textarea> element before proceeding with the replacement.
   * Verifies that the locator is visible and not empty before replacing text.
   * Verifies that the locator's value has been updated with the replaced text after applying the replacements.
   * example usage:
   * await userInterfaceUtils.replaceTextWithinInput(locator, [
   *   [/PR-\d+/, 'PR-XXXXXX'],
   *   ['PR-1234567890', 'XXXXXXXXXXXXX'],
   *   [/\d{2}\/\d{2}\/\d{4}/, 'DD/MM/YYYY'],
   * ]);
   * @param locator - The locator whose text will be replaced.
   * @param replacements - An array of tuples where each tuple contains a pattern (string or RegExp) and its replacement string.
   */
  public async replaceTextWithinInput(locator: Locator, replacements: Array<[string | RegExp, string]>): Promise<void> {
    await expect(locator).toBeVisible();
    await expect(locator).not.toBeEmpty();

    const updatedValue = await locator.evaluate((node, replacements) => {
      const tag = node.tagName.toLowerCase();

      if (!('value' in node) || (tag !== 'textarea' && tag !== 'input')) {
        throw new Error(`The provided locator {${locator}} is not an <input> or <textarea> element.`);
      }

      let inputValue = (node as HTMLInputElement | HTMLTextAreaElement).value;

      for (const [pattern, replacement] of replacements) {
        if (typeof pattern === 'string' || pattern instanceof RegExp) {
          inputValue = inputValue.replace(pattern, replacement);
        }
      }

      (node as HTMLInputElement | HTMLTextAreaElement).value = inputValue;
      return inputValue;
    }, replacements);

    await expect(locator).toHaveValue(updatedValue);
  }

  /**
   * Replaces text within a static element, such as a <div> or <span>.
   * This is useful for visual testing where you want to ensure dynamic information is not visible in screenshots.
   * Verifies that the locator is visible and not empty before replacing text.
   * Verifies that the locator's text has been updated with the replaced text after applying the replacements.
   * example usage:
   * await userInterfaceUtils.replaceTextWithinStaticElement(locator, [
   *   [/PR-\d+/, 'PR-XXXXXX'],
   *   ['PR-1234567890', 'XXXXXXXXXXXXX'],
   *   [/\d{2}\/\d{2}\/\d{4}/, 'DD/MM/YYYY'],
   * ]);
   * @param locator - The locator whose text will be replaced.
   * @param replacements - An array of tuples where each tuple contains a pattern (string or RegExp) and its replacement string.
   */
  public async replaceTextWithinStaticElement(locator: Locator, replacements: Array<[string | RegExp, string]>): Promise<void> {
    await expect(locator).toBeVisible();
    await expect(locator).not.toBeEmpty();

    await locator.evaluate((node, replacements) => {
      let htmlContant = node.innerHTML;

      if (!htmlContant) {
        throw new Error(`The provided locator ${locator} does not have any inner HTML content.`);
      }

      for (const [pattern, replacement] of replacements) {
        const regex =
          typeof pattern === 'string'
            ? new RegExp(pattern, 'gi')
            : new RegExp(pattern.source, pattern.flags.includes('i') ? pattern.flags : pattern.flags + 'i');

        htmlContant = htmlContant.replace(regex, replacement);
      }

      node.innerHTML = htmlContant;
    }, replacements);

    for (const [, replacement] of replacements) {
      await expect(locator).toContainText(replacement);
    }
  }

  /**
   * Clicks on a specified element and waits for it to be hidden,
   * indicating that the navigation or action has been completed.
   * Verifies that the element is visible before clicking.
   * Verifies that the element is hidden after the click action.
   * @param elementToClickOn - The element to be clicked.
   */
  public async navigationClick(elementToClickOn: Locator): Promise<void> {
    await expect(elementToClickOn).toBeVisible();

    await expect(async () => {
      if ((await elementToClickOn.isVisible()) && (await elementToClickOn.isEnabled())) {
        await elementToClickOn.click();
      }
      await expect(elementToClickOn).toBeHidden({ timeout: 5_000 });
    }).toPass({ intervals: [1_000], timeout: 60_000 });
  }
}
