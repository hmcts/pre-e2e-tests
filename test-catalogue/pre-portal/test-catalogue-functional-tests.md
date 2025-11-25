# functional-tests catalogue

----------------------------------------------------------------------------------------------------
** File:** `playwright-e2e/tests/pre-portal/functional-tests/pre-portal-functional.spec.ts`

## Verify user is able to share recording with portal user, confirm playback is successful and unshare the recording afterwards
- Pre-Rquisite step in order to create a case and assign a recording via API
- Navigate to view recordings page in power app
- Search for recording by case reference and select option to share
- Navigate to pre-portal and verify playback of recording is successful
- Unshare the recording from the portal user within power app
- Verify portal user is no longer able to access the recording after unsharing

## Verify super user is able to navigate to edit request page and submit an edit request for a recording
- Navigate to edit request page
