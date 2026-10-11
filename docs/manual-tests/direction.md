# Direction — manual test checklist
Playground: Components → Direction. Run each step and write what you observed under "Result:".

## Interaction
- [ ] Toggle the direction button on the demo.
  Expected: The bordered box flips `dir`; tabs and menu mirror while the page stays LTR.
  Result:
## Keyboard
- [ ] RTL: focus the first tab, press ArrowLeft.
  Expected: Focus moves to the next tab.
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
