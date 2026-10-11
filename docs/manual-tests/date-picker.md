# Date Picker — manual test checklist
Playground: Components → Date Picker. Run each step and write what you observed under "Result:".

## Interaction
- [ ] Open, pick the 20th.
  Expected: Label shows the long date; popover closes; focus on the trigger.
  Result:
## Keyboard
- [ ] Esc with the popover open.
  Expected: Closes; focus returns.
  Result:
## Forms
- [ ] Bind a FormControl; set it programmatically.
  Expected: Label updates; picking updates the control.
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
