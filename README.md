# Offline Profiles

BMW MGU application for creating and switching local (offline) driver profiles.

> **Status: initial scaffold / not yet installable.** The repository is intentionally separate from `mgu-e39-m5-20d`. MGU package metadata, SDK bindings, and command signatures must be validated against the target MGU SDK and the supplied command reference before producing an installable package.

## Confirmed command flow

1. Invoke `PERSONALISATION_CREATE_LOCAL_ACCOUNT`.
2. Continue only when its response indicates a positive result.
3. Invoke `steuern_pia_04_change_profile` with argument `X;2`.
   - `X=0` selects the first profile button.
   - The mapping for buttons 2 and 3 is still to be verified.

See [command notes](docs/commands.md).

## Project principles

- No polling for a completion/status signal unless the command contract explicitly requires it.
- Log command dispatch, raw responses, parsing decisions, errors, and timestamps.
- Never treat a successful dispatch as proof that the profile was created or switched.
- Keep command transport behind an adapter so the SDK-specific implementation can be replaced without changing UI logic.
- Do not claim that a profile exists until the MGU provides a verified result through a documented mechanism.

## Repository layout

- `app/` — MGU application source and package metadata (to be completed against the SDK).
- `docs/` — command contracts, architecture, and validation notes.
- `tools/logger/` — small reusable diagnostic logger.
- `bench/` — test scenarios and captured, sanitized fixtures.

## Development status

| Area | Status |
|---|---|
| Repository scaffold | In progress |
| Command flow | Partially confirmed |
| MGU SDK/API binding | Not yet verified |
| UI | Not yet implemented |
| On-device validation | Pending |
| MGU package/build pipeline | Pending |

## Safety

This app must only call documented personalization/profile functions. Do not experiment with guessed command names or argument formats on a moving vehicle. Capture and redact logs before sharing; they may contain vehicle or user identifiers.
