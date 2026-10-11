# Toggle Group — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/toggle-group.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Set of toggles; `type="single"` or `"multiple"`, roving tabindex.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `toggle-group` | `div` | `role=group dir=ltr\|rtl data-variant=outline data-spacing=2\|1 data-orientation=horizontal\|vertical tabindex=0\|-1 data-size=sm\|lg` |
| `toggle-group-item` | `button` | `type=button aria-pressed=false\|true data-state=off\|on data-variant=outline\|default data-size=default\|sm\|lg data-spacing=2\|1 aria-label=Toggle bold\|Toggle italic\|Toggle strikethrough\|Toggle all tabindex=-1 data-radix-collection-item="" role=radio aria-checked=true\|false data-disabled="" disabled=""` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Root `role="group"`; items share variant/size; single mode uses `role="radio"` semantics in Radix (UNKNOWN whether the original does).
- Roving tabindex: only one item is in the tab order.

## Keyboard
| Keys | Result |
|---|---|
| ArrowRight / ArrowLeft (ArrowDown / ArrowUp when vertical) | Move focus (mirrored in RTL). |
| Home / End | First / last item. |
| Enter / Space | Toggles the focused item. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Home`, `End`.

## Deviations
- none recorded

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Roles used by the original in single mode.
- Screen-reader output.
