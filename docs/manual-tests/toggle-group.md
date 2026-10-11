# Toggle Group — manual test checklist
Playground: Components → Toggle Group. Run each step and write what you observed under "Result:".

## Interaction
- [ ] Single mode: select B then I.
  Expected: Only one pressed at a time.
  Result:
## Keyboard
- [ ] Tab once, then arrows, Home, End.
  Expected: One tab stop; arrows move focus; Home/End jump.
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
  Expected: ArrowLeft moves to the next item.
  Result:
