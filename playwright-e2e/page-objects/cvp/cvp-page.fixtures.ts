import { CvpPages } from './cvp-pages.js';
import { PageFixtures } from '../page.fixtures.js';

export interface CvpPageFixtures {
  cvpPages: CvpPages;
}

export const cvpPageFixtures = {
  cvpPages: async ({ determinePage }: PageFixtures, use) => {
    const cvpPages = new CvpPages(determinePage);
    await use(cvpPages);
  },
};
