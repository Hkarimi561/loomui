# Toggle — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/toggle.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Two-state button (`aria-pressed`), variants default/outline, sizes default/sm/lg.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `toggle` | `button` | `type=button aria-pressed=false data-state=off aria-label=Toggle bookmark\|Toggle italic\|Toggle bold\|Toggle small data-disabled="" disabled="" dir=rtl` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- `data-state` on/off mirrors `aria-pressed`.

## Keyboard
| Keys | Result |
|---|---|
| Enter / Space | Toggles. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- none recorded

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Screen-reader output on the original.
- RTL and dark-mode pixel comparison.
