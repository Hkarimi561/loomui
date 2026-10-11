# Marker — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/marker.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Inline divider/label in chat timelines ("Today", "New messages") with default, separator and border variants.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `marker` | `div` | `data-variant=default\|separator\|border role=status type=button` |
| `marker-icon` | `span` | `aria-hidden=true` |
| `marker-content` | `span` | — |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Root has `role="status"`.
- `separator` variant draws rules before/after the content.

## Keyboard
No keyboard interaction beyond native browser behavior.

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- none recorded

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Screen-reader output on the original.
- RTL and dark-mode pixel comparison.
