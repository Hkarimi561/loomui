# Field — behavior spec

Evidence: **[REA-DOM]** captured the live docs page(s) for this component (`docs/evidence/slots/field.json`: slots, tags, ARIA/data attributes, class strings). 
Not done: live keyboard run on the original, screen-reader output, RTL and dark-mode comparison against the original (see the manual test).

## Summary
Form layout primitives: set/legend, group, field (vertical/horizontal/responsive), label, description, error, separator.

## Structure [REA-DOM]
| slot (`data-slot`) | element | observed attributes |
|---|---|---|
| `field-group` | `div` | — |
| `field-set` | `fieldset` | — |
| `field-legend` | `legend` | `data-variant=legend\|label` |
| `field-description` | `p` | — |
| `field` | `div` | `role=group data-orientation=vertical\|horizontal\|responsive` |
| `field-label` | `label` | — |
| `field-separator` | `div` | `data-content=false` |
| `field-content` | `div` | — |


## Behavior
_Combines REA evidence with shadcn/Radix source knowledge; anything not observed on the live site is listed under UNKNOWN._

- `uiField` has `role="group"` and `data-orientation`; `data-invalid` styles label/description/error.
- `uiFieldError` renders a list when several messages are given.

## Keyboard
| Keys | Result |
|---|---|
| Tab | Moves focus through any interactive descendants in DOM order; the component adds no key handling of its own. |

Special-key literals found in the implementation (grep; modifier shortcuts such as Ctrl+B are not detected): none.

## Deviations
- Association between label/description/control (`for`, `aria-describedby`) is manual in templates — same as the original.

## Angular notes
Standalone directive(s) with signal inputs, OnPush, `cn()` class merging; state exposed through data-* attributes.

## UNKNOWN
- Screen-reader output on the original.
- RTL and dark-mode pixel comparison.
