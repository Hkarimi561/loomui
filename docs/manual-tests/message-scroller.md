# Message Scroller — manual test checklist
Playground: Components → Message Scroller. Run each step and write what you observed under "Result:".

## Interaction
- [ ] Load the page.
  Expected: View starts at the newest message; button inactive.
  Result:
- [ ] Scroll to the top and add a message.
  Expected: View stays; button becomes active.
  Result:
- [ ] Click the button.
  Expected: Smooth scroll to the end; button becomes inert.
  Result:
- [ ] At the end, add a message.
  Expected: View follows to the new message.
  Result:
## Keyboard
- [ ] Tab to the viewport, press ArrowUp/PageUp.
  Expected: Scrolls; button activates.
  Result:
## Screen reader
- [ ] Focus / operate the component with a screen reader.
  Expected: Region "Messages"; new items in the log are announced politely; `aria-busy` suppresses announcements while true.
  Result:
## Dark mode / RTL
- [ ] Toggle Dark in the header.
  Expected: Colors switch to the `.dark` tokens; no unreadable text, borders still visible.
  Result:
- [ ] Toggle RTL in the header.
  Expected: Layout mirrors (logical properties); directional icons flip; keyboard directions mirror where relevant.
  Result:
