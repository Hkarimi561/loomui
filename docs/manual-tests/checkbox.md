# Checkbox — manual test checklist
Playground: Components → Checkbox.

## Visual
- [ ] Unchecked.
  Expected: 16px square, 4px radius, `input` border, no check icon.
  Result:
- [ ] Hover. Expected: no visual change (the original has none). Result:
- [ ] Checked.
  Expected: primary fill, white check icon. DevTools: `aria-checked="true"`, `data-state="checked"`.
  Result:
- [ ] Indeterminate (third demo).
  Expected: filled, dash icon; `aria-checked="mixed"`; clicking makes it checked (not unchecked).
  Result:
- [ ] Disabled.
  Expected: 50% opacity, not-allowed cursor, ignores click; `disabled` and `data-disabled` present.
  Result:
- [ ] Invalid.
  Expected: red border and ring.
  Result:
- [ ] Click slightly outside the box (about 8px above/below).
  Expected: still toggles (hit area enlarged by `after:`).
  Result:

## Keyboard
- [ ] Tab to a checkbox. Expected: 3px focus ring, only for keyboard focus. Result:
- [ ] Space. Expected: toggles. Result:
- [ ] Enter. Expected: nothing happens. Result:
- [ ] Shift+Tab. Expected: focus goes to the previous control. Result:

## Forms
- [ ] Click "Two-way" label. Expected: checkbox toggles and the text shows true/false. Result:
- [ ] Reactive-form checkbox. Expected: text "Reactive form — true/false" follows the checkbox. Result:

## Screen reader
- [ ] Focus a checkbox. Expected: "<label>, checkbox, checked/not checked" ("partially checked" for indeterminate). Result:
- [ ] Toggle with Space. Expected: new state is announced. Result:

## Dark mode / RTL
- [ ] Dark. Expected: unchecked has `input/30` bg; checked is light fill with dark icon. Result:
- [ ] RTL. Expected: label sits left of the box; behavior identical. Result:
