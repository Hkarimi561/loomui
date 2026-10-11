# Data Table — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/data-table.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Recipe, not a packaged component: **TanStack Table v9 (`@tanstack/angular-table`)** for state + the Table primitives for markup. This library ships helper components for sorting menus, column visibility and pagination.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `button` | `a` | `data-active=false data-new=false data-variant=ghost\|default\|secondary\|outline data-size=sm\|icon\|default target=_blank rel=noreferrer role=link tabindex=0 disabled="" type=button` |
| `input` | `input` | — |
| `table-container` | `div` | — |
| `table` | `table` | — |
| `table-header` | `thead` | — |
| `table-row` | `tr` | `data-state=false` |
| `table-head` | `th` | — |
| `checkbox` | `button` | `type=button role=checkbox aria-checked=false data-state=unchecked aria-label=Select all\|Select row\|تحديد الكل\|تحديد الصف` |
| `table-body` | `tbody` | — |
| `table-cell` | `td` | — |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Feature set (`tableFeatures`) registers sorting, filtering, pagination, visibility and selection plus their row-model factories; kept outside the component.
- Playground demo: email text filter, sortable columns (Asc/Desc/Hide dropdown), row selection with header tri-state checkbox, column visibility menu, page size + Previous/Next.
- Helpers (`ui-data-table-column-header`, `ui-data-table-view-options`, `ui-data-table-pagination`) take structural subsets of the TanStack table/column, so any feature set works.

## Keyboard
| Keys | Result |
|---|---|
| Tab / Enter / Space | Reach and operate sort menus, checkboxes, pagination buttons (native + menu kit keys inside menus). |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- The original is React + `@tanstack/react-table` v8; this uses the v9 Angular adapter (`injectTable`, atoms for state).
- Rows-per-page uses a native `<select>` (the original uses a Select).

## Angular notes
Verified in browser: next page, sort desc, hide column, text filter, select-all (5 of 12 selected on page 1).

## UNKNOWN
- Behavior parity with react-table v8 edge cases (multi-sort, sorting removal cycles).
- Server-side modes were not built.
