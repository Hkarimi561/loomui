# Avatar — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/avatar.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Circular image with fallback; optional badge and overlapping group.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `avatar` | `span` | `data-size=default\|sm\|lg` |
| `avatar-image` | `img` | `alt=@shadcn\|@evilrabbit\|@maxleiter\|@pranathip` |
| `avatar-badge` | `span` | — |
| `avatar-group` | `div` | — |
| `avatar-group-count` | `div` | — |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- `img[uiAvatarImage]` reports load/error to the root; the fallback renders until the image has loaded (or when it errors).
- Group stacks avatars with negative margin and a ring; `uiAvatarGroupCount` shows "+N".

## Keyboard
No keyboard interaction beyond native browser behavior.

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- Radix Avatar delays the fallback (`delayMs`); not implemented.

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Fallback delay behavior.
