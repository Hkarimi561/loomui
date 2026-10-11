# Spinner — manual test checklist
Playground: Components → Spinner. Run each step and write what you observed under "Result:".

## Visual
- [ ] Spinner inside a button and standalone.
  Expected: Rotates smoothly; inherits text color.
  Result:
## Screen reader
- [ ] Focus / operate the component with a screen reader.
  Expected: Announced as "Loading" status.
  Result:
## Dark mode / RTL
- [ ] Toggle Dark in the header.
  Expected: Colors switch to the `.dark` tokens; no unreadable text, borders still visible.
  Result:
- [ ] Toggle RTL in the header.
  Expected: Layout mirrors (logical properties); directional icons flip; keyboard directions mirror where relevant.
  Result:
