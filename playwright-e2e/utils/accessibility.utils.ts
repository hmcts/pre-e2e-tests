import axe from 'axe-core';

export async function runAxeAuditIgnoringRules(page, ignoreRules: string[] = []) {
  const axePath = require.resolve('axe-core/axe.min.js');
  await page.addScriptTag({ path: axePath });

  const results = await page.evaluate(async () => axe.run());
  return results.violations.filter((v) => !ignoreRules.includes(v.id));
}
