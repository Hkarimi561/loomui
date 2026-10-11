# Menubar — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/menubar.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Horizontal bar of menus with roving focus across triggers; menu kit for items.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `menubar` | `div` | `role=menubar tabindex=0 data-orientation=horizontal` |
| `menubar-trigger` | `button` | `type=button role=menuitem aria-haspopup=menu aria-expanded=true\|false data-state=open\|closed tabindex=0\|-1 data-orientation=horizontal data-radix-collection-item=""` |
| `menubar-content` | `div` | `data-side=bottom data-align=start role=menu aria-orientation=vertical data-state=open data-radix-menu-content="" dir=ltr data-radix-menubar-content="" tabindex=-1 data-orientation=vertical` |
| `menubar-group` | `div` | `role=group` |
| `menubar-item` | `div` | `role=menuitem data-variant=default tabindex=-1 data-orientation=vertical data-radix-collection-item="" aria-disabled=true data-disabled=""` |
| `menubar-shortcut` | `span` | — |
| `menubar-separator` | `div` | `role=separator aria-orientation=horizontal` |
| `menubar-sub-trigger` | `div` | `role=menuitem aria-haspopup=menu aria-expanded=false data-state=closed data-radix-menubar-subtrigger="" tabindex=-1 data-orientation=vertical data-radix-collection-item=""` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Root `role="menubar"`; triggers `aria-haspopup="menu"`, `aria-expanded`.
- When one menu is open, hovering or pressing arrows moves to the neighboring menu.

## Keyboard
| Keys | Result |
|---|---|
| ArrowRight / ArrowLeft on a trigger | Move to next/previous menu (mirrored in RTL). |
| ArrowDown / Enter / Space | Open the menu on its first item. |
| Esc | Closes; focus returns to the trigger. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Enter`, `Space`.

## Deviations
- none recorded

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Tab behavior into/out of the bar versus Radix.
