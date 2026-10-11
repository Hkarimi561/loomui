# Textarea — manual test checklist
Playground: Components → Textarea. Run each step and write what you observed under "Result:".

## Visual
- [ ] Empty, filled, disabled, invalid (`aria-invalid`).
  Expected: Ring on focus; destructive ring when invalid.
  Result:
## Forms
- [ ] ngModel / reactive form binding.
  Expected: Value round-trips.
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
