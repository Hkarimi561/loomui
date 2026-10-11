# Hover Card — manual test checklist
Playground: Components → Hover Card. Run each step and write what you observed under "Result:".

## Interaction
- [ ] Hover the trigger for ~1s.
  Expected: Card opens after the delay.
  Result:
- [ ] Move the pointer into the card, then away.
  Expected: Stays open inside; closes shortly after leaving.
  Result:
## Keyboard
- [ ] Tab to the trigger.
  Expected: Card opens (UNKNOWN for the original — note what you see).
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
