# Calendar — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/calendar.json`: slots, tags, ARIA/data attributes, class strings). The live Calendar is react-day-picker v9; DOM/class strings were captured from the Calendar and Date Picker demos (`calendar.json`, `calendar-days.json`).
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Month grid date selection: `mode` single / multiple / range, 1+ months, outside days, disabled days. Own implementation with native `Date` + `Intl` (no date library).

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `calendar` | `div` | `data-mode=single\|range dir=rtl data-multiple-months=true data-week-numbers=true` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Grid is `table[role=grid]` with `td[role=gridcell][data-day]`; day buttons carry `data-selected-single`, `data-range-start|middle|end`, `data-today`, `data-outside`, `data-disabled`.
- Month navigation with prev/next buttons; caption shows the localized month + year.
- Range mode: first click sets `from`, second sets `to` (swapped if earlier); clicking again restarts.

## Keyboard
| Keys | Result |
|---|---|
| ArrowLeft / ArrowRight | −1 / +1 day (mirrored in RTL). |
| ArrowUp / ArrowDown | −1 / +1 week. |
| PageUp / PageDown | −1 / +1 month (Shift: year). |
| Home / End | Start / end of week. |
| Enter / Space | Select the focused day. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Home`, `End`, `PageUp`, `PageDown`.

## Deviations
- Weekday header cell class was hand-fixed in `calendar.classes.ts` after the generator matched the weekday row instead of the cell.
- react-day-picker extras (week numbers, dropdown captions, custom formatters) are not implemented.

## Angular notes
`div[uiCalendar]`: `[(selected)]` (Date | Date[] | {from,to}), ControlValueAccessor, `numberOfMonths`, `weekStartsOn`, `showOutsideDays`.

## UNKNOWN
- Behavior of disabled-date ranges vs react-day-picker.
- Screen-reader grid navigation output.
- Locale-specific week start defaults.
