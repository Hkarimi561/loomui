# Hover Card — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/hover-card.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Preview card shown on pointer hover or keyboard focus of the trigger.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `hover-card-trigger` | `button` | `data-variant=outline data-size=default data-state=closed` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Open delay ~700 ms, close delay ~300 ms (Radix defaults); stays open while the pointer is over the card.
- Content is a non-modal popper (`role` none); not announced to AT by Radix design.

## Keyboard
| Keys | Result |
|---|---|
| Focus the trigger | Opens the card (as focus-visible hover equivalent). |
| Esc | Closes. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- none recorded

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Not verified in-browser (hover timers); delays are Radix defaults, not measured.
