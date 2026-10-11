# Label — manual test checklist
Playground: Components → Label.

- [ ] Look.
  Expected: 14px medium text, no selection on double-click (`select-none`).
  Result:
- [ ] Click the label "Accept terms and conditions".
  Expected: the checkbox toggles; the checkbox does not need to be clicked directly.
  Result:
- [ ] Double-click the label text.
  Expected: text is not selected.
  Result:
- [ ] Tab to the checkbox with a screen reader on.
  Expected: announces "Accept terms and conditions, checkbox, not checked".
  Result:
- [ ] Label next to a disabled control (see Checkbox page, "Disabled").
  Expected: label is dimmed to 50% when the control is the `peer` and disabled.
  Result:
- [ ] Dark mode.
  Expected: label text uses foreground color, readable.
  Result:
- [ ] RTL.
  Expected: label sits to the left of the checkbox (row mirrored); gap preserved.
  Result:
