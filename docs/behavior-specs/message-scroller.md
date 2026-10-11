# Message Scroller — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/message-scroller.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Chat viewport that sticks to the newest message and exposes a "scroll to latest" button.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `message-scroller` | `div` | `data-scrollable=start\|start end\|end` |
| `message-scroller-viewport` | `div` | `role=region aria-label=Messages tabindex=0 data-scrollable=start\|start end\|end` |
| `message-scroller-content` | `div` | `role=log aria-relevant=additions aria-busy=false` |
| `message-scroller-item` | `div` | `data-message-id=group-1\|group-2\|group-3\|msg-1 data-scroll-anchor=false\|true` |
| `message` | `div` | `data-align=end\|start` |
| `message-content` | `div` | — |
| `message-header` | `div` | — |
| `message-scroller-button` | `button` | `data-variant=secondary data-size=icon-sm data-active=false\|true data-direction=end type=button inert="" tabindex=-1` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Viewport: `role="region" aria-label="Messages" tabindex="0"`; content: `role="log" aria-relevant="additions" aria-busy`.
- `data-scrollable` on root/viewport lists the edges that have more content ("start", "end", "start end").
- Stick-to-end: while at the end, new content (ResizeObserver) keeps the view at the end; scrolling up releases it. Verified in browser.
- Button: `data-direction="end"`, `data-active` toggled, `inert` + `tabindex=-1` while at the end.

## Keyboard
| Keys | Result |
|---|---|
| Tab | Focus the viewport (scrollable region) then the button when active. |
| Arrow / Page keys | Native scrolling inside the focused viewport. |
| Enter / Space on the button | Scrolls smoothly to the end. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- Stick-to-end and scroll anchoring are our reconstruction (the original logic was not read from source).

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- `data-scroll-anchor` semantics beyond scroll-into-view on add.
- Original handling of prepended (history) messages.
