# Alert Dialog — manual test checklist
Playground: Components → Alert Dialog. Run each step and write what you observed under "Result:".

## Interaction
- [ ] Click the dark backdrop.
  Expected: Dialog stays open.
  Result:
- [ ] Click Continue.
  Expected: `(action)` fires and the dialog closes.
  Result:
## Keyboard
- [ ] Tab ×3.
  Expected: Focus loops within the dialog.
  Result:
## Focus
- [ ] Open the dialog.
  Expected: Focus is on Cancel.
  Result:
- [ ] Press Esc.
  Expected: Dialog closes; focus returns to the trigger.
  Result:
## Screen reader
- [ ] Focus / operate the component with a screen reader.
  Expected: "alert dialog, <title>, <description>"; the page behind is hidden from AT.
  Result:
## Dark mode / RTL
- [ ] Toggle Dark in the header.
  Expected: Colors switch to the `.dark` tokens; no unreadable text, borders still visible.
  Result:
- [ ] Toggle RTL in the header.
  Expected: Layout mirrors (logical properties); directional icons flip; keyboard directions mirror where relevant.
  Result:
