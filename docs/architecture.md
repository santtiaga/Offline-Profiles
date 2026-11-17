# Architecture

## Runtime layers

```
UI (three profile actions)
        |
Profile controller
        |
Personalization service
        |
MGU command adapter  ---- Diagnostic logger
        |
Verified MGU SDK / command transport
```

### UI
Displays the three profile actions and a bounded activity log. It must distinguish:
- request not sent;
- request dispatched;
- immediate command response received;
- confirmed outcome (only if a documented outcome signal exists).

### Profile controller
Owns the user flow and prevents overlapping operations. It must not invent completion semantics or retry non-idempotent account creation automatically.

### Personalization service
Contains the business sequence:
- create local account;
- validate the documented positive response;
- switch to the requested profile using a verified mapping.

### MGU command adapter
The only layer allowed to depend on SDK-specific command invocation. Keep the transport injectable so the logic can be tested on a desktop harness.

### Diagnostic logger
Structured, bounded in-memory log with optional export. Redact identifiers and never block the UI thread.

## Failure handling

- Transport exception: log and report dispatch failure.
- Negative or malformed create response: do not call the switch command.
- Switch dispatch exception: report that switching was not dispatched successfully.
- No documented completion event: do not poll; label the operation as dispatched, not completed.

## Current implementation boundary

This scaffold deliberately does not contain guessed SDK imports, manifest fields, command invocation functions, or a fabricated build script. Those must be taken from a known-working MGU app template / SDK version so that the resulting package is actually installable.
