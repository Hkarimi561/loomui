# Aspect Ratio — manual test checklist
Playground: Components → Aspect Ratio. Run each step and write what you observed under "Result:".

## Visual
- [ ] 16/9 and 1/1 boxes.
  Expected: Heights are exactly width×9/16 and width.
  Result:
- [ ] Resize the window.
  Expected: Ratio holds; no layout jump.
  Result:
## Screen reader
- [ ] Focus / operate the component with a screen reader.
  Expected: No semantics added.
  Result:
## Dark mode / RTL
- [ ] Toggle Dark in the header.
  Expected: Colors switch to the `.dark` tokens; no unreadable text, borders still visible.
  Result:
- [ ] Toggle RTL in the header.
  Expected: Layout mirrors (logical properties); directional icons flip; keyboard directions mirror where relevant.
  Result:
