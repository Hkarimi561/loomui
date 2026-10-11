# Switch — manual test checklist
Playground: Components → Switch.

## Visual
- [ ] Off.
  Expected: 32×18px pill, `input` colored track, thumb at the start edge. DevTools: `aria-checked="false"`, `data-state="unchecked"`.
  Result:
- [ ] On.
  Expected: primary track, thumb slides to the end edge over ~150ms.
  Result:
- [ ] Small (`size="sm"`).
  Expected: 24×14px track, 12px thumb.
  Result:
- [ ] Disabled off / on.
  Expected: 50% opacity, not-allowed cursor, ignores click.
  Result:

## Keyboard
- [ ] Tab to a switch. Expected: 3px focus ring. Result:
- [ ] Space. Expected: toggles. Result:
- [ ] Enter. Expected: toggles (native button; UNKNOWN on the original — note what you see). Result:

## Forms
- [ ] "Small, reactive" switch. Expected: label text follows the control. Result:

## Screen reader
- [ ] Focus a switch. Expected: "<label>, switch, off/on". Result:
- [ ] Toggle. Expected: new state announced. Result:

## Dark mode / RTL
- [ ] Dark. Expected: off track `input/80`; checked thumb uses primary-foreground. Result:
- [ ] RTL. Expected: off = thumb at the **right** edge, on = thumb moves to the **left** edge (mirrored). Result:
