# Drawer — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/drawer.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Bottom sheet that can be dragged to dismiss (vaul-style); also top/left/right.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `drawer-trigger` | `button` | `data-variant=outline data-size=default type=button aria-haspopup=dialog aria-expanded=true\|false data-state=open\|closed` |
| `drawer-overlay` | `div` | `data-state=open data-vaul-overlay="" data-vaul-snap-points=false data-vaul-snap-points-overlay=true data-vaul-animate=true data-aria-hidden=true aria-hidden=true` |
| `drawer-content` | `div` | `role=dialog data-state=open data-vaul-drawer-direction=bottom data-vaul-drawer="" data-vaul-delayed-snap-points=false data-vaul-snap-points=false data-vaul-custom-container=false data-vaul-animate=true tabindex=-1` |
| `drawer-header` | `div` | — |
| `drawer-title` | `h2` | — |
| `drawer-description` | `p` | — |
| `drawer-footer` | `div` | — |
| `drawer-close` | `button` | `data-variant=outline data-size=default type=button` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Modal like Dialog (focus trap, scroll lock); handle bar on bottom drawers.
- Pointer drag past a threshold or fast flick dismisses; otherwise snaps back.

## Keyboard
| Keys | Result |
|---|---|
| Esc | Closes, returns focus to the trigger. |
| Tab | Cycles inside. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- Drag physics (velocity thresholds, snap points, scaled background) are simplified compared to vaul.

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Drag was not exercised in an automated/real-pointer run; snap points not implemented.
