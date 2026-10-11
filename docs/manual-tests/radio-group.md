# Radio Group — manual test checklist
Playground: Components → Radio Group. Run each step and write what you observed under "Result:".

## Interaction
- [ ] Click B.
  Expected: B is checked (indicator dot), A unchecked.
  Result:
## Keyboard
- [ ] Tab into group, ArrowDown ×2, ArrowUp, Home, End.
  Expected: Focus and selection move together; disabled items are skipped.
  Result:
## Forms
- [ ] Bind with a reactive FormControl.
  Expected: Value round-trips; disabled state propagates.
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
