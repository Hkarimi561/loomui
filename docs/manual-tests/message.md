# Message — manual test checklist
Playground: Components → Message. Run each step and write what you observed under "Result:".

## Visual
- [ ] Start and end messages.
  Expected: End message right-aligned in LTR, left-aligned in RTL.
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
