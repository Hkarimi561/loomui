# Table — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/table.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Styled table primitives (container, table, caption, header, body, footer, row, head, cell).

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `table-container` | `div` | — |
| `table` | `table` | `dir=rtl` |
| `table-caption` | `caption` | — |
| `table-header` | `thead` | — |
| `table-row` | `tr` | — |
| `table-head` | `th` | — |
| `table-body` | `tbody` | — |
| `table-cell` | `td` | `colspan=3` |
| `table-footer` | `tfoot` | — |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Container gives horizontal scroll; rows hover-highlight and `data-state="selected"` highlights.
- Checkbox cells get tighter padding via `[role=checkbox]` selectors.

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
