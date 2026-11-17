# MGU personalization command notes

This document separates confirmed observations from assumptions. Do not promote an item to **confirmed** without a source trace, SDK declaration, or reproducible MGU response.

## 1. Create local account

**Command:** `PERSONALISATION_CREATE_LOCAL_ACCOUNT`

**Known behavior:** the command is used to request creation of a local/offline driver account.

**Still to verify:**
- Exact invocation mechanism in the MGU app SDK.
- Whether the command takes arguments.
- Exact response schema and positive-result discriminator.
- Whether duplicate local accounts are rejected, reused, or renamed.
- Whether the command is synchronous from the caller's perspective.

The app should log the raw response and parse it through a dedicated adapter. Do not infer success from the absence of an exception.

## 2. Switch profile

**Command:** `steuern_pia_04_change_profile`

**Known argument format:** `X;2`.

**Known mapping:** `X=0` corresponds to the first profile button.

**Unverified mapping:** values for buttons 2 and 3. The likely sequence must not be hardcoded until verified against the command reference or a captured working invocation.

## 3. Required flow

1. User selects one of the three profile actions.
2. App sends `PERSONALISATION_CREATE_LOCAL_ACCOUNT` using the verified SDK transport.
3. App logs dispatch and response.
4. Only a documented positive response permits the next call.
5. App invokes `steuern_pia_04_change_profile` with the verified argument.
6. App logs the dispatch and any immediate response/error.
7. UI reports only what is actually known. If no completion signal is documented, show that the request was sent—not that switching completed.

## 4. Logging requirements

Every entry should include:
- ISO-8601 timestamp;
- level (`DEBUG`, `INFO`, `WARN`, `ERROR`);
- operation/correlation ID;
- command name;
- event (`dispatch`, `response`, `parse`, `exception`);
- sanitized arguments and response;
- elapsed time when measurable.

Never log credentials, private keys, or unnecessary personal identifiers.

## 5. Evidence needed to finish the contract

- Original command-reference PDF and the page(s) describing both commands.
- Screenshot or trace showing the positive response from account creation.
- Trace of the profile-change command for each of the three button positions.
- SDK example showing how the MGU app dispatches the relevant command.

Until these are available, command transport and response parsing remain TODOs.
