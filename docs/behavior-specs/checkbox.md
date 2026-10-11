# Checkbox — behavior spec

Evidence: **[REA-DOM]** DOM of `…/radix/checkbox` (unchecked, checked, disabled). **[LIVE]** real key presses in the built-in browser with `aria-checked` read after each. Not done: source/Radix cross-check, indeterminate on the live site, form-submission (hidden input), RTL, dark.

## Structure [REA-DOM]
```
<button type="button" role="checkbox" aria-checked="false|true" data-state="unchecked|checked"
        value="on" data-slot="checkbox" [disabled data-disabled=""] id="…">
  <span data-slot="checkbox-indicator" data-state="checked" style="pointer-events:none"><svg …/></span>   ← only when checked
</button>
```
The indicator is **not rendered when unchecked** [REA-DOM, LIVE: `indicator=false`]. A hidden `<input aria-hidden>` was **not found next to the demo** (outside a form) [LIVE]; behavior inside forms UNKNOWN.

## State table
| state | aria-checked | data-state | notes |
|---|---|---|---|
| unchecked | false | unchecked | |
| checked | true | checked | `data-checked:` classes → primary bg |
| disabled | (unchanged) | (unchanged) | `disabled=""` and `data-disabled=""` |
| indeterminate | mixed (Radix) | indeterminate | UNKNOWN live; implemented per Radix |

## Keyboard [LIVE]
| Key | Result |
|---|---|
| Space | toggles |
| Enter | **no change** (Radix prevents it, matching checkbox convention) |
| Tab | focus ring: `focus-visible:ring-3 ring-ring/50 border-ring` |

## Classes
`peer relative flex size-4 shrink-0 … rounded-[4px] border border-input … after:absolute after:-inset-x-3 after:-inset-y-2 …` — the `after:` pseudo-element enlarges the hit area. `data-checked:` variants: see "Angular notes".

## Angular notes
- `button[uiCheckbox]`: `[(checked)]`, `ControlValueAccessor` (ngModel / reactive forms), and `checked` model + `disabled`/`invalid` inputs matching Angular 22's `FormCheckboxControl` for signal forms (not yet exercised with `[field]`).
- Requires custom variants (defined in the playground `styles.css`): `data-checked`, `data-unchecked` mapping to `data-state`.

## UNKNOWN
Indeterminate styling; hidden-input form value; screen-reader output; RTL; dark.
