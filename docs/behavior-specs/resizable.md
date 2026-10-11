# Resizable — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/resizable.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Panel group with draggable/keyboard-resizable handles (react-resizable-panels style).

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `resizable-panel-group` | `div` | `data-group=true data-testid=_R_43aanpfknqbr6lb_\|_R_7k3aanpfknqbr6lb_\|_R_5naanpfknqbr6lb_\|_R_63aanpfknqbr6lb_ dir=rtl` |
| `resizable-panel` | `div` | `data-panel=true data-testid=_R_1k3aanpfknqbr6lb_\|_R_3k3aanpfknqbr6lb_\|_R_vk3aanpfknqbr6lb_\|_R_1vk3aanpfknqbr6lb_` |
| `resizable-handle` | `div` | `aria-orientation=vertical\|horizontal data-separator=inactive data-testid=_R_2k3aanpfknqbr6lb_\|_R_1fk3aanpfknqbr6lb_\|_R_2lnaanpfknqbr6lb_\|_R_2m3aanpfknqbr6lb_ role=separator tabindex=0 aria-valuemax=100 aria-valuemin=0 aria-valuenow=50\|25` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Handle has `role="separator"`, `aria-valuenow/min/max`, `aria-controls`; panels use percentage sizes.

## Keyboard
| Keys | Result |
|---|---|
| ArrowLeft / ArrowRight (ArrowUp / ArrowDown vertical) | Resize by a step. |
| Home / End | Collapse towards min / max. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Home`, `End`.

## Deviations
- none recorded

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Collapsible-panel behavior and persistence (autoSaveId).
