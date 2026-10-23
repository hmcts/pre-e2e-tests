# functional-tests catalogue

----------------------------------------------------------------------------------------------------
** File:** `playwright-e2e/tests/pre-portal/functional-tests/pre-portal-functional.spec.ts`

## Verify user is able to share recording with portal user, confirm playback is successful and unshare the recording afterwards
- Pre-Rquisite step in order to create a case and assign a recording via API
- Navigate to view recordings page in power app
- Search for recording by case reference and select option to share
- Navigate to pre-portal and verify playback of recording is successful
- Unshare the recording from the portal user within power app

## Verify user is able to navigate to user admin page from pre-portal home page
- Navigate to pre-portal home page
- Select user admin from header links and verify user admin page is displayed

## Verify user is able to navigate to help page from pre-portal home page
- Navigate to pre-portal home page
- Select help from header links and verify help page is displayed

## Verify user is able to navigate to support page from pre-portal home page
- Navigate to pre-portal home page
- Select support from header links and verify support page is displayed

## Verify user is able to navigate to system status page from pre-portal home page
- Navigate to pre-portal home page
- Select system status from header links and verify system status page is displayed

## Verify user is able to navigate to management page from pre-portal home page
- Navigate to pre-portal home page
- Select management from header links and verify management page is displayed

## Verify user is able to navigate back to recordings page from user admin page
- Navigate to pre-portal home page and then user admin page
- Select recordings from header links and verify recordings page is displayed

## Verify details of version 1 existing recording is accurately displayed on pre-portal home page
- Navigate to pre-portal home page
- Verify details of case reference (${caseData.caseReference}) are accurately displayed on the home page

## Verify user is able to playback version 1 of an existing recording which has been pre assigned to user
- Navigate to pre-portal home page and select case reference (PLAYWRIGHT)
- Verify playback of recording is successful

## Verify recording details are accurately displayed on pre-portal watch recordings page for version 1 of an existing recording
- Navigate to pre-portal home page and select case reference (PLAYWRIGHT)
- Verify recording details are displayed accurately

## Verify user is able to sign out from pre-portal home page
- Navigate to pre-portal home page
- Select sign out from header links and verify sign out page is displayed
