# Showcase extras — manual test checklist
These are showcase features (not library components). Run them in a real browser; reduced-motion users should see no animation.

## Landing
- [ ] Hero: animated gradient mesh; drag the four floating cards (lg+ screens); click Success/Info/Delete… on them.
  Expected: smooth, no lag; the dialog traps focus and Esc closes it.
  Result:
- [ ] "Write this, get that": scroll it into view.
  Expected: code types out at a steady speed, the card on the right builds up piece by piece, then rests and loops. With reduced motion: full code, no typing.
  Result:
- [ ] "Light, dark…" slider: drag the handle, then use ArrowLeft/Right, Shift+Arrow, Home, End.
  Expected: the dark theme is revealed over the light one; `aria-valuenow` follows.
  Result:
- [ ] "Layers": hover or focus the 3D stack.
  Expected: layers fan out; in RTL the tilt mirrors.
  Result:
- [ ] "Build a form": click a field, drag one onto the form, reorder/remove fields, edit a label, tick Required.
  Expected: preview and generated code update instantly; the code uses `<ui-*>` elements.
  Result:
- [ ] "Today's pick": wait for the preview; click Shuffle.
  Expected: a live demo loads in the frame; Shuffle changes it; "Open page" navigates.
  Result:

## Shell
- [ ] ⌘/Ctrl+K palette: type a name, ArrowDown through results (wide screens).
  Expected: after ~250 ms the right side previews the highlighted component live; Enter navigates; Esc closes.
  Result:
- [ ] Header sound button (default off): enable, then toggle a switch, click a button, trigger a toast.
  Expected: short quiet cues (on/off ticks, pop, success/error notes) and vibration on supporting phones; the choice survives reload; disabled by default.
  Result:
- [ ] Scroll any long page.
  Expected: header shrinks, thin progress bar under it; no jank.
  Result:
- [ ] Open a component page on a slow connection (DevTools throttling).
  Expected: a skeleton appears in the demo frame if the demo chunk takes longer than ~120 ms.
  Result:

## Themes page
- [ ] Open **Themes**; click Apply on a preset; toggle Dark/RTL.
  Expected: each card shows light and dark previews of that accent; Apply recolors the whole site; the choice persists.
  Result:
