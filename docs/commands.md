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


## 6. Captured diagnostic invocation — local account creation

**Evidence supplied from a live MGU diagnostic trace:**

```text
apiJob("HU_MGU", "steuern_routine*, 'ARG;PERSONALISATION_CREATE_LOCAL_ACCOUNT;STR'", "")
```

Decoded job fields:

| Field | Observed value |
|---|---|
| ECU / object | `HU_MGU` |
| Routine job | `steuern_routine` |
| Variant | `HU_MGU` |
| Job status | `OKAY` |
| Diagnostic request | `31 01 A1 9A` |
| Diagnostic response prefix | `71 01 A1 9A` |
| Response payload length shown | `63 Bytes` |

The request prefix `31 01 A1 9A` is a UDS RoutineControl startRoutine request for routine identifier `0xA19A`. The positive response prefix `71 01 A1 9A` matches the positive response service for that request.

**Interpretation:** `PERSONALISATION_CREATE_LOCAL_ACCOUNT` is passed as the argument string to the MGU's `steuern_routine` job. It is not itself the UDS routine identifier. The UDS routine identifier observed on the wire is `A1 9A`.

**Response body:** the trace includes an ASCII-like payload beginning with bytes `64 65 2E 62 61 69 6E 6D 65 6E 74 2E ...`, but the supplied dump is truncated/partially garbled. Do not infer the full returned string or treat it as a success flag until the complete 63-byte payload is captured and decoded.

**Important distinction:** `JOBSTATUS = OKAY` and a UDS positive response establish that the diagnostic job/routine request was accepted/executed at the diagnostic layer. They do not, by themselves, prove that a new local driver profile was persisted or activated.

### Next capture required

Capture the complete `_RESPONSE` byte sequence (all 63 payload bytes) and, if available, the corresponding decoded text/result shown by the diagnostic tool. Preserve exact byte order and spacing. This will let us identify the application-level result without guessing.
