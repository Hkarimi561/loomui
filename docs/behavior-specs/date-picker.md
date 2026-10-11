# Date Picker — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/date-picker.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Recipe: outline Button trigger + Popover + Calendar. Trigger has `data-empty` and muted text until a date is chosen.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `popover-trigger` | `button` | `data-variant=ghost\|secondary\|outline data-size=default\|sm\|icon-xs\|icon-sm type=button aria-haspopup=dialog aria-expanded=false\|true data-state=closed\|open data-empty=true aria-label=Select date tabindex=0 data-base-ui-click-trigger="" dir=rtl` |
| `popover-anchor` | `div` | — |
| `popover-content` | `div` | `data-side=bottom data-align=start data-state=open role=dialog tabindex=-1` |
| `calendar` | `div` | `data-mode=single` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Choosing a day sets the value, closes the popover and returns focus to the trigger.
- Label uses `Intl.DateTimeFormat(locale, {dateStyle:"long"})`.

## Keyboard
| Keys | Result |
|---|---|
| Enter / Space on the trigger | Opens the popover; focus moves into the calendar. |
| Esc | Closes and returns focus to the trigger. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- The original is a documented recipe (no packaged component); `ui-date-picker` is a convenience wrapper. Range / date-time variants are not provided (compose `uiCalendar mode="range"` yourself).

## Angular notes
`ui-date-picker`: `[(value)]` (Date | null), ControlValueAccessor (reactive forms verified), `placeholder`, `locale`, `disabled`, `invalid`.

## UNKNOWN
- Original recipe markup was captured from the demos only (button + popover + calendar); form integration is our design.
