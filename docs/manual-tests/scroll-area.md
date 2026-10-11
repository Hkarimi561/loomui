# Scroll Area — manual test checklist
Playground: Components → Scroll Area. Run each step and write what you observed under "Result:".

## Interaction
- [ ] Wheel over the area; drag the thumb.
  Expected: Content scrolls; thumb tracks.
  Result:
## Keyboard
- [ ] Focus viewport; Arrow/Page keys.
  Expected: Native scroll.
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
