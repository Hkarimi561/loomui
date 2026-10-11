# Radio Group — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/radio-group.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Single-choice group of radio buttons built from `button[role=radio]`.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `radio-group` | `div` | `role=radiogroup aria-required=false dir=ltr\|rtl tabindex=0` |
| `radio-group-item` | `button` | `type=button role=radio aria-checked=false\|true data-state=unchecked\|checked tabindex=-1 data-radix-collection-item="" data-disabled="" disabled="" aria-invalid=true dir=rtl` |
| `radio-group-indicator` | `span` | `data-state=checked` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Roving tabindex: the checked item (or the first enabled one) is the tab stop.
- Arrow keys move focus **and** select (as native radios).

## Keyboard
| Keys | Result |
|---|---|
| ArrowDown / ArrowRight | Next item (mirrored in RTL for horizontal direction). |
| ArrowUp / ArrowLeft | Previous item. |
| Home / End | First / last enabled item. |
| Space | Selects the focused item. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Home`, `End`.

## Deviations
- none recorded

## Angular notes
ControlValueAccessor + `[(value)]`. Items use a non-required `value` input.

## UNKNOWN
- Original keyboard trace was throttled in the hidden pane; verified on the own build only.
