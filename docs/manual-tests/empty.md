# Empty — manual test checklist
Playground: Components → Empty. Run each step and write what you observed under "Result:".

## Visual
- [ ] Empty state with icon, title, description and a button.
  Expected: Centered, dashed border, muted description.
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
