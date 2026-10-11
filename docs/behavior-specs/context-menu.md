# Context Menu — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/context-menu.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Menu opened at the pointer by right-click / long-press; shares the menu kit with Dropdown Menu (items, checkbox/radio items, sub-menus).

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `context-menu-trigger` | `span` | `data-state=open\|closed` |
| `context-menu-content` | `div` | `data-side=right data-align=start role=menu aria-orientation=vertical data-state=open data-radix-menu-content="" dir=ltr tabindex=-1 data-orientation=vertical` |
| `context-menu-group` | `div` | `role=group` |
| `context-menu-item` | `div` | `role=menuitem data-variant=default tabindex=-1 data-orientation=vertical data-radix-collection-item="" aria-disabled=true data-disabled=""` |
| `context-menu-shortcut` | `span` | — |
| `context-menu-sub-trigger` | `div` | `role=menuitem aria-haspopup=menu aria-expanded=false data-state=closed tabindex=-1 data-orientation=vertical data-radix-collection-item=""` |
| `context-menu-separator` | `div` | `role=separator aria-orientation=horizontal` |
| `context-menu-checkbox-item` | `div` | `role=menuitemcheckbox aria-checked=true\|false data-state=checked\|unchecked tabindex=-1 data-orientation=vertical data-radix-collection-item=""` |
| `context-menu-radio-group` | `div` | `role=group` |
| `context-menu-label` | `div` | — |
| `context-menu-radio-item` | `div` | `role=menuitemradio aria-checked=true\|false data-state=checked\|unchecked tabindex=-1 data-orientation=vertical data-radix-collection-item=""` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Opens on `contextmenu` at pointer coordinates (virtual anchor); first item is not auto-focused for pointer opens in Radix (UNKNOWN here).
- Typeahead and roving focus come from the shared menu kit.

## Keyboard
| Keys | Result |
|---|---|
| ArrowDown / ArrowUp | Move between items. |
| ArrowRight / ArrowLeft | Open / close sub-menu (mirrored in RTL). |
| Enter / Space | Selects the item. |
| Esc | Closes. |
| Typeahead | Focus the item starting with the typed text. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- none recorded

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Long-press (touch) activation.
- Keyboard invocation of the trigger.
