# Avatar — manual test checklist
Playground: Components → Avatar. Run each step and write what you observed under "Result:".

## Visual
- [ ] Avatar with a valid image.
  Expected: Image visible, fallback hidden.
  Result:
- [ ] Avatar with a broken `src`.
  Expected: Fallback initials are shown.
  Result:
- [ ] Avatar group.
  Expected: Overlapping avatars with ring; count bubble at the end.
  Result:
## Screen reader
- [ ] Focus / operate the component with a screen reader.
  Expected: Image announced by its alt; decorative fallback text is read as content (give the root an aria-label when needed).
  Result:
## Dark mode / RTL
- [ ] Toggle Dark in the header.
  Expected: Colors switch to the `.dark` tokens; no unreadable text, borders still visible.
  Result:
- [ ] Toggle RTL in the header.
  Expected: Layout mirrors (logical properties); directional icons flip; keyboard directions mirror where relevant.
  Result:
