# Badge — manual test checklist
Playground: Components → Badge. Header toggles for Dark / RTL.

- [ ] All five variants render (default, secondary, destructive, outline, ghost).
  Expected: pill shape (fully rounded), 20px high, 12px medium text; colors per variant.
  Result:
- [ ] Hover a plain `<span>` badge of each variant.
  Expected: only `ghost` changes (muted bg); others do not change.
  Result:
- [ ] Hover the "as link" badge (`<a>`).
  Expected: background lightens/darkens (`/80`).
  Result:
- [ ] Tab through the page.
  Expected: spans are skipped; the link badge gets a 3px focus ring.
  Result:
- [ ] Screen reader on a span badge.
  Expected: read as plain text, no role announced.
  Result:
- [ ] Screen reader on the link badge.
  Expected: "as link, link".
  Result:
- [ ] Dark mode.
  Expected: destructive uses `destructive/20` bg; text readable in all variants.
  Result:
- [ ] RTL.
  Expected: layout unchanged (symmetric); an icon child with `data-icon="inline-start"` would have its small padding on the right.
  Result:
