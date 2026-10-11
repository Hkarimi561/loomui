# Attachment — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/attachment.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
File/attachment chip for chat UIs: group, media (icon/image), content (title + description), actions and an overlay trigger link/button. State: idle/uploading/processing/done.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `attachment-group` | `div` | — |
| `attachment` | `div` | `data-state=done\|uploading\|idle\|processing data-size=default\|sm\|xs data-orientation=vertical\|horizontal` |
| `attachment-media` | `div` | `data-variant=image\|icon` |
| `attachment-content` | `div` | — |
| `attachment-title` | `span` | — |
| `attachment-description` | `span` | — |
| `attachment-actions` | `div` | — |
| `attachment-action` | `button` | `data-variant=ghost data-size=icon-xs aria-label=Cancel upload\|Remove message-renderer.tsx\|Remove workspace.png\|Remove desk-reference.jpg` |
| `attachment-trigger` | `a` | `target=_blank rel=noreferrer aria-label=Open workspace.png\|Open desk-reference.jpg\|Open office-reference.jpg\|Preview research-summary.pdf type=button aria-haspopup=dialog aria-expanded=false data-state=closed` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- `data-state`, `data-size`, `data-orientation` on the root drive styling; media variants `icon`/`image`.
- `uiAttachmentTrigger` is an absolutely-positioned overlay (z-10) making the whole chip clickable; `uiAttachmentAction` buttons sit above it (z-20).

## Keyboard
| Keys | Result |
|---|---|
| Tab | Moves focus through any interactive descendants in DOM order; the component adds no key handling of its own. |
| Enter / Space | Activates the trigger (native link/button) or an action button. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- Image/upload progress visuals are class-only; no upload logic.

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Exact aria-label conventions the original uses for the trigger.
- Upload/processing visuals beyond classes.
