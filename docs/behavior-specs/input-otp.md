# Input OTP — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/input-otp.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Segmented one-time-code input; one hidden input drives visual slots.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `input-otp-group` | `div` | — |
| `input-otp-slot` | `div` | `data-active=false aria-invalid=true` |
| `input-otp` | `input` | `autocomplete=one-time-code spellcheck=false data-input-otp=true inputmode=numeric maxlength=6\|4 data-input-otp-mss=0 data-input-otp-mse=0 data-input-otp-placeholder-shown=true pattern=^\d+$\|^[a-zA-Z0-9]+$ disabled="" required="" dir=rtl` |
| `input-otp-separator` | `div` | `role=separator` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- A single transparent `<input>` receives typing, paste, and autofill (`autocomplete="one-time-code"`); slots mirror characters and show a blinking caret.
- `(complete)` fires when `maxLength` characters are present.

## Keyboard
| Keys | Result |
|---|---|
| Type digits | Fill slots in order. |
| Backspace | Deletes the last character. |
| Paste | Fills as many slots as fit. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- none recorded

## Angular notes
ControlValueAccessor + `[(value)]`; caret uses `animate-caret-blink` (add the keyframes from the playground styles).

## UNKNOWN
- Pattern filtering (`REGEXP_ONLY_DIGITS`) parity.
- Mobile autofill behavior.
