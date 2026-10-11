# Scroll Area — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/scroll-area.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Custom-styled scrollbars over a native scroll viewport.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `scroll-area` | `div` | `dir=ltr\|rtl` |
| `scroll-area-viewport` | `div` | `data-radix-scroll-area-viewport=""` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Viewport is natively scrollable (keyboard and wheel behave natively); thumb size/position follow scroll; dragging the thumb scrolls.

## Keyboard
| Keys | Result |
|---|---|
| Arrow keys / PageUp / PageDown / Home / End | Native scrolling when the viewport is focused. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- Scrollbar visibility policy (`type="hover|scroll|auto|always"`) is simplified.

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Hover/scroll auto-hide timings of Radix ScrollArea.
