# Collapsible — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/collapsible.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Single show/hide region controlled by a trigger.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `collapsible` | `div` | `data-state=closed dir=rtl` |
| `collapsible-trigger` | `button` | `data-variant=ghost\|outline data-size=icon type=button aria-expanded=false data-state=closed` |
| `collapsible-content` | `div` | `data-state=closed hidden=""` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Trigger `aria-expanded`/`aria-controls`; content `data-state` with height animation.

## Keyboard
| Keys | Result |
|---|---|
| Enter / Space | Toggles (native button). |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- none recorded

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Screen-reader output on the original.
- RTL and dark-mode pixel comparison.
