# Progress — manual test checklist
Playground: Components → Progress. Run each step and write what you observed under "Result:".

## Visual
- [ ] Value 0, 60, 100.
  Expected: Indicator width matches percentage; track is primary/20.
  Result:
## Interaction
- [ ] Change value over time (demo).
  Expected: Indicator transitions smoothly.
  Result:
## Screen reader
- [ ] Focus / operate the component with a screen reader.
  Expected: "progress bar, 60%".
  Result:
## Dark mode / RTL
- [ ] Toggle Dark in the header.
  Expected: Colors switch to the `.dark` tokens; no unreadable text, borders still visible.
  Result:
- [ ] Toggle RTL in the header.
  Expected: Indicator fills from the right.
  Result:
