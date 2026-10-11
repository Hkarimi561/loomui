# Navigation Menu — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/navigation-menu.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Site navigation with trigger items opening content panels and plain links; no shared viewport animation.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `navigation-menu` | `nav` | `aria-label=Main data-orientation=horizontal dir=ltr\|rtl data-viewport=true` |
| `navigation-menu-list` | `ul` | `data-orientation=horizontal dir=ltr\|rtl` |
| `navigation-menu-item` | `li` | — |
| `navigation-menu-trigger` | `button` | `data-state=open\|closed aria-expanded=true\|false data-radix-collection-item=""` |
| `navigation-menu-link` | `a` | `data-radix-collection-item="" data-lang=ar` |
| `navigation-menu-viewport` | `div` | `data-state=open data-orientation=horizontal` |
| `navigation-menu-content` | `div` | `data-orientation=horizontal dir=ltr` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- `nav` > list > items; triggers `aria-expanded`; opening one closes others.
- Content is positioned under the trigger (viewport=false layout).

## Keyboard
| Keys | Result |
|---|---|
| ArrowRight / ArrowLeft | Move between top-level items (mirrored in RTL). |
| ArrowDown / Enter / Space | Open the panel. |
| Home / End | First / last item. |
| Esc | Closes the open panel. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Home`, `End`, `Escape`.

## Deviations
- Only `viewport=false` layout implemented; the shared animated viewport and indicator are not.

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Not verified in-browser; viewport/indicator animation parity.
