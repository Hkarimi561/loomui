# Chart — manual test checklist
Playground: Components → Chart. Run each step and write what you observed under "Result:".

## Visual
- [ ] Bar, line and doughnut examples.
  Expected: Series use `--chart-1..` colors; legend swatches match.
  Result:
## Interaction
- [ ] Hover bars/points.
  Expected: Tooltip appears with the series label and value.
  Result:
## Screen reader
- [ ] Focus the canvas.
  Expected: Announced as an image with the given label (no data table — known gap).
  Result:
## Dark mode / RTL
- [ ] Toggle Dark in the header.
  Expected: Colors switch to the `.dark` tokens; no unreadable text, borders still visible.
  Result:
- [ ] Toggle RTL in the header.
  Expected: Layout mirrors (logical properties); directional icons flip; keyboard directions mirror where relevant.
  Result:
