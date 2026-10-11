# Item — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/item.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Generic list row: media, title/description content and trailing actions; variants default/outline/muted, sizes default/sm.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `item` | `div` | `data-variant=outline\|default\|muted data-size=default\|sm\|xs role=listitem target=_blank rel=noopener noreferrer dir=rtl` |
| `item-content` | `div` | — |
| `item-title` | `div` | — |
| `item-description` | `p` | — |
| `item-actions` | `div` | — |
| `item-media` | `div` | `data-variant=default\|icon\|image` |
| `item-group` | `div` | `role=list` |
| `item-header` | `div` | — |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Pure layout; can be an `a`/`button` for interactive rows (`[a]:hover`).

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
