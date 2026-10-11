# Attachment — manual test checklist
Playground: Components → Attachment. Run each step and write what you observed under "Result:".

## Visual
- [ ] Three attachments in a group.
  Expected: Rounded chips with title and muted description; group wraps/gaps as in the original.
  Result:
## Interaction
- [ ] Click the × on one chip.
  Expected: Chip is removed (demo handler); focus does not jump to the page top.
  Result:
## Keyboard
- [ ] Tab through a chip with trigger + action.
  Expected: Trigger first, then action; both show focus rings.
  Result:
## Screen reader
- [ ] Focus / operate the component with a screen reader.
  Expected: Trigger announced with its aria-label; action announced as "Remove <file>, button".
  Result:
## Dark mode / RTL
- [ ] Toggle Dark in the header.
  Expected: Colors switch to the `.dark` tokens; no unreadable text, borders still visible.
  Result:
- [ ] Toggle RTL in the header.
  Expected: Layout mirrors (logical properties); directional icons flip; keyboard directions mirror where relevant.
  Result:
