# Native Select — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/native-select.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Styled native `<select>` with a chevron icon wrapper.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `native-select-wrapper` | `div` | `data-size=default` |
| `native-select` | `select` | `data-size=default disabled="" aria-invalid=true dir=rtl` |
| `native-select-option` | `option` | — |
| `native-select-icon` | `svg` | `xmlns=http://www.w3.org/2000/svg width=24 height=24 viewBox=0 0 24 24 fill=none stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round aria-hidden=true` |
| `native-select-optgroup` | `optgroup` | `label=Engineering\|Sales\|Operations` |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- Keeps all native behavior (type-ahead, mobile pickers, forms).
- Wrapper positions the icon; `data-size` default/sm.

## Keyboard
| Keys | Result |
|---|---|
| Arrow keys / type-ahead / Enter / Esc | Native `<select>` behavior (browser-dependent). |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- none recorded

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Screen-reader output on the original.
- RTL and dark-mode pixel comparison.
