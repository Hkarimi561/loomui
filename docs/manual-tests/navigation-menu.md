# Navigation Menu — manual test checklist
Playground: Components → Navigation Menu. Run each step and write what you observed under "Result:".

## Interaction
- [ ] Hover/click a trigger.
  Expected: Panel opens beneath it; hovering another trigger switches panels.
  Result:
## Keyboard
- [ ] Arrows, Home/End, Esc.
  Expected: As listed.
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
