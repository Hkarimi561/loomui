# Field — manual test checklist
Playground: Components → Field. Run each step and write what you observed under "Result:".

## Visual
- [ ] Vertical field with description.
  Expected: Label above control; description muted below.
  Result:
- [ ] Horizontal field.
  Expected: Label and control in a row; control aligned to the end.
  Result:
- [ ] Invalid field (`data-invalid`).
  Expected: Label/description turn destructive; error text shown.
  Result:
## Forms
- [ ] Click the label.
  Expected: Focus moves to the control (requires matching `for`/`id`).
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
