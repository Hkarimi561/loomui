# Slider — manual test checklist
Playground: Components → Slider. Run each step and write what you observed under "Result:".

## Interaction
- [ ] Click on the track far from the thumb.
  Expected: Thumb jumps; value updates.
  Result:
- [ ] Drag the thumb past the ends.
  Expected: Clamped to min/max.
  Result:
## Keyboard
- [ ] Tab to a thumb; arrows, PageUp/Down, Home, End.
  Expected: Value changes as listed.
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
  Expected: Track fills from the right; ArrowLeft increases.
  Result:
