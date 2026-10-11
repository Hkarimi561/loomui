# Input OTP — manual test checklist
Playground: Components → Input OTP. Run each step and write what you observed under "Result:".

## Interaction
- [ ] Type 6 digits.
  Expected: Slots fill; `complete` fires once on the 6th.
  Result:
- [ ] Paste "123456".
  Expected: All slots fill at once.
  Result:
## Keyboard
- [ ] Backspace at various lengths.
  Expected: Last digit removed; caret slot follows.
  Result:
## Forms
- [ ] Reactive control.
  Expected: Value round-trips.
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
  Expected: Layout mirrors (logical properties); directional icons flip; keyboard directions mirror where relevant.
  Result:
