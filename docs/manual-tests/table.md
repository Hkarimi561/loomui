# Table — manual test checklist
Playground: Components → Table. Run each step and write what you observed under "Result:".

## Visual
- [ ] Table with header, body, footer and caption.
  Expected: Header text muted/medium; row dividers; caption below.
  Result:
- [ ] Hover a row; set `data-state="selected"`.
  Expected: Hover and selected backgrounds.
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
