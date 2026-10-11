# Breadcrumb — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/breadcrumb.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Navigation trail: list of links, current page, separators and an ellipsis item.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `breadcrumb` | `nav` | `aria-label=breadcrumb dir=rtl` |
| `breadcrumb-list` | `ol` | — |
| `breadcrumb-item` | `li` | — |
| `breadcrumb-link` | `a` | — |
| `breadcrumb-separator` | `li` | `role=presentation aria-hidden=true` |
| `breadcrumb-ellipsis` | `span` | `role=presentation aria-hidden=true` |
| `breadcrumb-page` | `span` | `role=link aria-disabled=true aria-current=page` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- `nav` has `aria-label="breadcrumb"`; current page is a span with `aria-current="page"` and `aria-disabled`.
- Separator is `role="presentation" aria-hidden` and the default chevron flips in RTL.

## Keyboard
| Keys | Result |
|---|---|
| Tab | Moves focus through any interactive descendants in DOM order; the component adds no key handling of its own. |
| Enter | Follows a focused link (native). |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- none recorded

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Screen-reader output on the original.
- RTL and dark-mode pixel comparison.
