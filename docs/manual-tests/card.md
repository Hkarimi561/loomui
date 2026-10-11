# Card — manual test checklist
Playground: Components → Card.

- [ ] Default card.
  Expected: rounded-xl, 1px subtle ring (no heavy border), 16px vertical padding and 16px gap between header/content/footer.
  Result:
- [ ] Header with action.
  Expected: title and description on the left, "Sign Up" link-button on the right spanning both rows.
  Result:
- [ ] Footer.
  Expected: top border, muted tinted background, flush to the card bottom (no extra bottom padding).
  Result:
- [ ] `size="sm"` card.
  Expected: spacing shrinks to 12px; title text 14px.
  Result:
- [ ] Tab through the card.
  Expected: only the buttons are focusable; the card itself is not.
  Result:
- [ ] Screen reader.
  Expected: reads text in order; no landmark/role announced for the card.
  Result:
- [ ] Dark mode.
  Expected: card bg `--card`, ring visible but subtle, footer tint visible.
  Result:
- [ ] RTL.
  Expected: action moves to the left; text right-aligned; footer buttons full width.
  Result:
