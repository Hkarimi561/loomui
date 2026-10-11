# Marker — manual test checklist
Playground: Components → Marker. Run each step and write what you observed under "Result:".

## Visual
- [ ] Each variant.
  Expected: Separator shows lines on both sides; border shows a bottom rule.
  Result:
## Screen reader
- [ ] Focus / operate the component with a screen reader.
  Expected: role="status" is a polite live region: inserting a marker announces its text.
  Result:
## Dark mode / RTL
- [ ] Toggle Dark in the header.
  Expected: Colors switch to the `.dark` tokens; no unreadable text, borders still visible.
  Result:
- [ ] Toggle RTL in the header.
  Expected: Layout mirrors (logical properties); directional icons flip; keyboard directions mirror where relevant.
  Result:
