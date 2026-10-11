# Resizable — manual test checklist
Playground: Components → Resizable. Run each step and write what you observed under "Result:".

## Interaction
- [ ] Drag the handle.
  Expected: Panels resize; min sizes respected.
  Result:
## Keyboard
- [ ] Tab to handle; arrows, Home, End.
  Expected: Resizes in steps; separator values update.
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
  Expected: Horizontal arrow directions mirror.
  Result:
