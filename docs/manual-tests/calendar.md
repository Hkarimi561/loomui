# Calendar — manual test checklist
Playground: Components → Calendar. Run each step and write what you observed under "Result:".

## Visual
- [ ] Single calendar with today selected.
  Expected: Today has the primary background; 7-column grid; weekday headers evenly spaced.
  Result:
- [ ] Range calendar with 2 months and a selected range.
  Expected: Start/end rounded, middle days muted; two months side by side.
  Result:
## Interaction
- [ ] Click next, then previous month.
  Expected: Caption updates; no layout jump.
  Result:
- [ ] Range: click day 5 then day 12, then day 3.
  Expected: Range 5–12 highlights; third click restarts or swaps per spec.
  Result:
## Keyboard
- [ ] Focus a day; ArrowRight/Left/Up/Down, PageUp/Down, Home, End.
  Expected: Focus moves as listed and crosses month boundaries by changing the shown month.
  Result:
- [ ] Enter / Space.
  Expected: Day selected.
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
  Expected: Arrow directions mirror; navigation chevrons flip.
  Result:
