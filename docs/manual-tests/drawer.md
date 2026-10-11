# Drawer — manual test checklist
Playground: Components → Drawer. Run each step and write what you observed under "Result:".

## Interaction
- [ ] Open; drag the drawer down by >30% height and release.
  Expected: Dismisses with animation.
  Result:
- [ ] Drag a little and release.
  Expected: Snaps back.
  Result:
## Keyboard
- [ ] Esc.
  Expected: Closes; focus returns.
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
