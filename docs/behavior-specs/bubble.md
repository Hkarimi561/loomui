# Bubble — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/bubble.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Chat bubble with variants (default, muted, secondary, tinted, outline, destructive, ghost), alignment and optional reactions.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `bubble` | `div` | `data-variant=default\|muted\|secondary\|tinted data-align=end\|start` |
| `bubble-content` | `div` | — |
| `bubble-group` | `div` | — |
| `bubble-reactions` | `div` | `data-align=end\|start data-side=bottom\|top role=img aria-label=Reaction: thumbs up\|Reactions: thumbs up, fire, eyes, and 2 more\|Reaction: fire\|Reactions: eyes` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- `align` (`start`/`end`) mirrors alignment and corner rounding using logical classes.
- `uiBubbleReactions` is an absolutely positioned pill (`role="img"`) overlapping the bubble edge.

## Keyboard
No keyboard interaction beyond native browser behavior.

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- none recorded

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Reaction popover/interaction behavior (not part of the captured markup).
