# Driver profile test scenarios

Run only on a stationary vehicle with the MGU awake. Use a test setup where unintended profile changes are acceptable.

## Cases

1. First profile button: verify create response, then verify switch argument `0;2`.
2. Second profile button: capture the documented argument and response; mapping is currently unknown.
3. Third profile button: capture the documented argument and response; mapping is currently unknown.
4. Account creation rejected: verify that the switch command is not dispatched.
5. Transport failure during account creation: verify no switch command is dispatched.
6. Switch transport failure: verify the UI reports dispatch failure, not successful switching.
7. Repeated tap: verify the controller prevents overlapping account-creation requests.

## Capture format

Store sanitized traces as JSON fixtures. Remove VINs, account identifiers, personal names, and other identifying data before committing.
