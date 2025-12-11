import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../base';
import { config } from '../../../utils';

export class PowerAppMsSignInPage extends Base {
  public readonly $inputs = {
    email: this.page.getByRole('textbox', { name: 'Enter your email' }),
    password: this.page.getByRole('textbox', { name: 'Enter the password' }),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    nextButton: this.page.getByRole('button', { name: 'Next' }),
    signInButton: this.page.getByRole('button', { name: 'Sign in' }),
  } as const satisfies Record<string, Locator>;

  public readonly $staySignedInButton = (option: 'Yes' | 'No'): Locator => this.page.getByRole('button', { name: option });

  public readonly $static = {
    microsoftLogo: this.page.getByRole('img', { name: 'Microsoft' }),
    signInHeading: this.page.getByRole('heading', { name: 'Sign in' }),
    passwordHeading: this.page.getByRole('heading', { name: 'Enter password' }),
    staySignedInHeading: this.page.getByRole('heading', { name: 'Stay signed in?' }),
  } as const satisfies Record<string, Locator>;

  constructor(page: Page) {
    super(page);
  }

  /**
   * Signs in to the Microsoft account using the provided email and password.
   * @param email - The email address to sign in with.
   * @param password - The password for the account.
   */
  public async signIn(email: string, password: string): Promise<void> {
    await this.page.goto(config.urls.prePowerAppUrl);

    await expect(this.$static.microsoftLogo).toBeVisible();
    await expect(this.$static.signInHeading).toBeVisible();
    await this.$inputs.email.fill(email);
    await expect(this.$interactive.nextButton).toBeVisible();
    await this.navigationClick(this.$interactive.nextButton);

    await expect(this.$static.passwordHeading).toBeVisible();
    await this.$inputs.password.fill(password);
    await expect(this.$interactive.signInButton).toBeVisible();
    await this.navigationClick(this.$interactive.signInButton);

    await expect(this.$static.staySignedInHeading).toBeVisible();
    await expect(this.$staySignedInButton('Yes')).toBeVisible();
    await this.navigationClick(this.$staySignedInButton('Yes'));

    await expect.poll(() => this.page.url()).toContain('apps.powerapps.com/play/');
  }
}
