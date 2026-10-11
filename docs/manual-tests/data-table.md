# Data Table — manual test checklist
Playground: Components → Data Table. Run each step and write what you observed under "Result:".

## Interaction
- [ ] Type "o" in the filter.
  Expected: Rows narrow to matching emails; pagination counts update.
  Result:
- [ ] Header menu → Desc on Email.
  Expected: Rows reorder descending; the header icon shows ↓.
  Result:
- [ ] Header menu → Hide on Amount (or View → toggle).
  Expected: Column disappears from head and body.
  Result:
- [ ] Header checkbox.
  Expected: All rows on the current page select; footer reads "5 of 12 row(s) selected."
  Result:
- [ ] Next / Previous; change rows per page.
  Expected: Page counter and rows update; buttons disable at the ends.
  Result:
## Keyboard
- [ ] Tab to a header trigger, Enter, ArrowDown, Enter.
  Expected: Menu opens, item chosen, sort applied; focus returns to the trigger.
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
