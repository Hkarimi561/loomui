# Pagination — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/pagination.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Page navigation: links, previous/next, ellipsis; the current link is `aria-current="page"`.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `pagination` | `nav` | `role=navigation aria-label=pagination dir=rtl` |
| `pagination-content` | `ul` | — |
| `pagination-item` | `li` | — |
| `pagination-link` | `a` | `aria-label=Go to previous page\|Go to next page data-variant=ghost\|outline data-size=default\|icon aria-current=page data-active=true` |
| `pagination-ellipsis` | `span` | `aria-hidden=true` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- `nav` has `role="navigation" aria-label="pagination"`.
- Active link uses the outline button style; Previous/Next include chevrons (mirrored in RTL).

## Keyboard
| Keys | Result |
|---|---|
| Tab | Moves focus through any interactive descendants in DOM order; the component adds no key handling of its own. |
| Enter | Follows the focused link. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- none recorded

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Screen-reader output on the original.
- RTL and dark-mode pixel comparison.
