# Bubble — manual test checklist
Playground: Components → Bubble. Run each step and write what you observed under "Result:".

## Visual
- [ ] Each variant, start and end aligned.
  Expected: End-aligned bubbles hug the end edge; colors match the variant names.
  Result:
- [ ] Long text.
  Expected: Wraps inside max width; newline characters preserved (`whitespace-pre-line`).
  Result:
## Screen reader
- [ ] Focus / operate the component with a screen reader.
  Expected: Plain text content; reactions announced as an image with its aria-label if you provide one.
  Result:
## Dark mode / RTL
- [ ] Toggle Dark in the header.
  Expected: Colors switch to the `.dark` tokens; no unreadable text, borders still visible.
  Result:
- [ ] Toggle RTL in the header.
  Expected: Layout mirrors (logical properties); directional icons flip; keyboard directions mirror where relevant.
  Result:
