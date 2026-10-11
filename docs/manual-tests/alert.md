# Alert — manual test checklist
Playground: Components → Alert. Run each step and write what you observed under "Result:".

## Visual
- [ ] Default and destructive alerts, with and without an icon.
  Expected: Grid aligns icon + text; destructive title uses the destructive color; description is muted.
  Result:
- [ ] Alert with an action.
  Expected: Action sits at the end edge (top, inline-end).
  Result:
## Screen reader
- [ ] Focus / operate the component with a screen reader.
  Expected: An alert inserted dynamically is announced immediately (role="alert").
  Result:
## Dark mode / RTL
- [ ] Toggle Dark in the header.
  Expected: Colors switch to the `.dark` tokens; no unreadable text, borders still visible.
  Result:
- [ ] Toggle RTL in the header.
  Expected: Layout mirrors (logical properties); directional icons flip; keyboard directions mirror where relevant.
  Result:
