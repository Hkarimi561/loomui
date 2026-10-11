# Separator — manual test checklist
Playground: Components → Separator.

- [ ] Horizontal separator.
  Expected: 1px high, full width, `--border` color.
  Result:
- [ ] Vertical separators between Blog / Docs / Source.
  Expected: 1px wide, stretch to the row height (20px).
  Result:
- [ ] Inspect element (DevTools).
  Expected: `role="none"`, `data-orientation`, `data-slot="separator"`.
  Result:
- [ ] Tab through the page.
  Expected: separators are never focused.
  Result:
- [ ] Screen reader.
  Expected: nothing announced for decorative separators.
  Result:
- [ ] Dark mode.
  Expected: line visible (white 10% in dark).
  Result:
- [ ] RTL.
  Expected: vertical separators mirror along with the row order.
  Result:
