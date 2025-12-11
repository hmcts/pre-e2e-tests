import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../base';

export class PortalB2cLoginPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    email: this.page.getByRole('textbox', { name: 'Email Address' }),
    password: this.page.getByRole('textbox', { name: 'Password' }),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    signInButton: this.page.getByRole('button', { name: 'Sign in' }),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    signInHeading: this.page.getByRole('heading', { name: 'Sign in' }),
  } as const satisfies Record<string, Locator>;

  /**
   * Signs in to the Microsoft account using the provided email and password.
   * @param email - The email address to sign in with.
   * @param password - The password for the account.
   */
  public async signIn(email: string, password: string): Promise<void> {
    await expect.poll(() => this.page.url()).toContain('b2clogin');

    await expect(this.$static.signInHeading).toBeVisible();
    await this.$inputs.email.fill(email);
    await this.$inputs.password.fill(password);
    await this.navigationClick(this.$interactive.signInButton);

    await expect.poll(() => this.page.url()).toContain('pre-portal');
  }
}
