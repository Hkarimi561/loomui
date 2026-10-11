# Input Group — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/input-group.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Input/textarea with leading/trailing addons (icons, text, buttons) sharing one border and focus ring.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `input-group` | `div` | `role=group dir=rtl` |
| `input-group-control` | `input` | `type=password\|email readonly=""` |
| `input-group-addon` | `div` | `role=group data-align=inline-start\|inline-end\|block-start\|block-end` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- `uiInputGroup` has `role="group"`; focus ring moves to the group when the inner control is focused (`has-[[data-slot=input-group-control]:focus-visible]`).
- Clicking an addon (not a button) focuses the control.

## Keyboard
| Keys | Result |
|---|---|
| Tab | Moves focus through any interactive descendants in DOM order; the component adds no key handling of its own. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- none recorded

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Screen-reader output on the original.
- RTL and dark-mode pixel comparison.
