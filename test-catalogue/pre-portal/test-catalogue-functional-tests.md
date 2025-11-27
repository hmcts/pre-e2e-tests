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

## Verify details of version 1 existing recording is accurately displayed on pre-portal home page
- Navigate to pre-portal home page
- Verify details of case reference (PLAYWRIGHT) are accurately displayed on the home page

## Verify user is able to playback version 1 of an existing recording which has been pre assigned to user
- Navigate to pre-portal home page and select case reference (PLAYWRIGHT)
- Verify playback of recording is successful

## Verify recording details are accurately displayed on pre-portal watch recordings page for version 1 of an existing recording
- Navigate to pre-portal home page and select case reference (PLAYWRIGHT)
- Verify recording details are displayed accurately
