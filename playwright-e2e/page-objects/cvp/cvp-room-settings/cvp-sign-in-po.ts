import { Locator, expect } from '@playwright/test';
import { config } from '../../../utils';
import { CvpBase } from '../cvp-base';

export class CvpSignInPage extends CvpBase {
  public readonly $interactive = {
    signInButton: this.page.getByRole('button', { name: 'Sign in' }),
  } as const satisfies Record<string, Locator>;

  public readonly $inputs = {
    userName: this.page.getByRole('textbox', { name: 'username' }),
    password: this.page.getByRole('textbox', { name: 'password' }),
  } as const satisfies Record<string, Locator>;

  public async goTo(): Promise<void> {
    await this.page.goto(config.urls.cvpSettingsUrl);
  }

  public async verifyUserIsOnCvpSignInPage(): Promise<void> {
    await expect(this.$interactive.signInButton).toBeVisible({ timeout: 30000 });
  }

  /**
   * Signs in to the CVP application by filling in the username and password fields,
   * and clicking the sign-in button.
   * @param userName - The username to sign in with.
   * @param password - The password to sign in with.
   */
  public async signIn(userName: string, password: string): Promise<void> {
    await this.$inputs.userName.fill(userName);
    await this.$inputs.password.fill(password);
    await this.$interactive.signInButton.click();
  }
}
