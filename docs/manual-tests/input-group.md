# Input Group — manual test checklist
Playground: Components → Input Group. Run each step and write what you observed under "Result:".

## Visual
- [ ] Group with leading and trailing addon.
  Expected: Single rounded border; addons separated with muted text.
  Result:
## Interaction
- [ ] Click the leading addon text.
  Expected: Caret appears in the input.
  Result:
## Focus
- [ ] Tab into the input.
  Expected: Ring is drawn around the whole group, not just the input.
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
