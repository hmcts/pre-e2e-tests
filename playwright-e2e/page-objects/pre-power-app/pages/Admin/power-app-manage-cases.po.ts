import { Page, Locator, expect } from '@playwright/test';
import { Base } from '../../base';

export class PowerAppManageCasesPage extends Base {
  constructor(page: Page) {
    super(page);
  }

  public readonly $inputs = {
    caseReference: this.iFrame.locator('input[appmagic-control="AdmMngCasesSrchCasesTxttextbox"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $interactive = {
    adminButton: this.iFrame.locator('[data-control-name="AdmMngCasesAdmin_Icn"]'),
    deleteCaseButton: this.iFrame.locator('[data-control-name="adminScrn_ManageCasesCasesDelete_Icn"]'),
    manageCasesButton: this.iFrame.locator('[data-control-name="AdmMngCasesManageCases_Icn"]'),
  } as const satisfies Record<string, Locator>;

  public readonly $static = {
    casesLabel: this.iFrame.locator('[data-control-name="adminScrn_ManageCasesCasesHeader_Lbl"]'),
    listItemsInSearchResultsGallery: this.iFrame.locator('[data-control-part="gallery-item"]'),
    caseReferenceInSearchResults: this.iFrame.locator('[data-control-name="adminScrn_ManageCasesCasesReference_Lbl"]'),
  } as const satisfies Record<string, Locator>;

  public async verifyUserIsOnManageCasesPage(): Promise<void> {
    await expect(this.$static.casesLabel).toBeVisible({ timeout: 15000 });
  }
  public async searchForAnExistingCase(caseReference: string): Promise<void> {
    await expect(async () => {
      await this.$inputs.caseReference.fill(caseReference);
      await expect(this.$inputs.caseReference).toHaveValue(caseReference, { timeout: 5000 });
      await this.verifySingleCaseReferenceIsReturned();
    }).toPass({ intervals: [1_000], timeout: 15_000 });
    await expect(this.$static.caseReferenceInSearchResults).toContainText(caseReference);
  }
  private async verifySingleCaseReferenceIsReturned(): Promise<void> {
    await expect(this.$static.listItemsInSearchResultsGallery).toHaveCount(1, { timeout: 5000 });
  }
}
