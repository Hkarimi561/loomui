# Pagination — manual test checklist
Playground: Components → Pagination. Run each step and write what you observed under "Result:".

## Visual
- [ ] Pagination with active page 2.
  Expected: Page 2 outlined; others ghost.
  Result:
## Keyboard
- [ ] Tab across links.
  Expected: Focus ring on each.
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
  Expected: Previous/Next swap sides; arrows mirror.
  Result:
