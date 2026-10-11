# Native Select — manual test checklist
Playground: Components → Native Select. Run each step and write what you observed under "Result:".

## Visual
- [ ] Default and sm sizes; disabled.
  Expected: Chevron at the end; disabled is 50% opacity.
  Result:
## Forms
- [ ] Bind with ngModel / reactive forms.
  Expected: Value round-trips (native select).
  Result:
## Screen reader
- [ ] Focus / operate the component with a screen reader.
  Expected: Role, name and state are announced as described in the spec.
  Result:
## Dark mode / RTL
- [ ] Toggle Dark in the header.
  Expected: Colors switch to the `.dark` tokens; no unreadable text, borders still visible.
  Result:
- [ ] Toggle RTL in the header.
  Expected: Chevron moves to the left; text aligns right.
  Result:
