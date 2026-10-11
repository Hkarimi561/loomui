# Spinner — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/spinner.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Animated loading icon (`role="status"`, `aria-label="Loading"`).

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `spinner` | `svg` | `xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox=0 0 24 24 fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round role=status aria-label=Loading data-icon=inline-start` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- SVG spinner rotated with `animate-spin`; size via `size-*` classes.

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
