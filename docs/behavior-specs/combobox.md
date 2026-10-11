# Combobox — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/combobox.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Searchable single-select: input filters a popup list of options.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `combobox-chips` | `div` | `role=toolbar` |
| `combobox-chip` | `div` | `tabindex=-1` |
| `combobox-chip-remove` | `button` | `type=button tabindex=-1 aria-disabled=false data-variant=ghost data-size=icon-xs` |
| `combobox-chip-input` | `input` | `autocomplete=off spellcheck=false autocorrect=off autocapitalize=none role=combobox aria-expanded=false aria-haspopup=listbox aria-autocomplete=list type=text` |
| `combobox-clear` | `button` | `type=button tabindex=-1 data-size=icon-xs data-visible=""` |
| `combobox-trigger` | `button` | `type=button tabindex=0 role=combobox aria-expanded=false aria-haspopup=dialog` |
| `combobox-content` | `div` | `data-open="" data-side=bottom data-align=start role=presentation tabindex=-1 data-chips=false` |
| `combobox-empty` | `div` | `role=status aria-live=polite aria-atomic=true` |
| `combobox-list` | `div` | `tabindex=-1 data-base-ui-focusable="" aria-orientation=vertical role=listbox` |
| `combobox-item` | `div` | `role=option aria-selected=false` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Input has `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`; options `role="option"`.
- Typing filters; Enter selects the highlighted option and closes; focus returns to the input.

## Keyboard
| Keys | Result |
|---|---|
| ArrowDown / ArrowUp | Open / move highlight. |
| Home / End | First / last option. |
| Enter | Select highlighted option. |
| Esc | Close. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): `ArrowUp`, `ArrowDown`, `Home`, `End`, `Enter`.

## Deviations
- Multi-select chips are not implemented (single select only).

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Chips (multiple) variant; clear button parity.
