# Alert — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/alert.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Callout box with optional leading icon, title, description and action. Variants default/destructive.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `alert` | `div` | `role=alert` |
| `alert-title` | `div` | — |
| `alert-description` | `div` | — |
| `alert-action` | `div` | — |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Static content; `role="alert"` is present on the observed markup (live-region announce on insertion).
- Icon presence changes the grid (icon + text columns) via `has-[>svg]` selectors.

## Keyboard
No keyboard interaction beyond native browser behavior.

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- none recorded

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Whether the live site toggles `aria-live` differently on static (non-inserted) alerts.
