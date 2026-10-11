# Button — manual test checklist

Run in the playground (`npm start`), section "Button". Use the header toggles for Dark and RTL.
Tick each item and fill in Result.

## Visual states (repeat for default, outline, secondary, ghost, destructive, link)
- [ ] Default: colors, radius and height (32px for size `default`) match the spec.
  Expected: primary = dark fill, light text; outline = border, transparent bg; link = no bg, underline on hover only.
  Result:
- [ ] Hover (mouse over): background changes per variant.
  Expected: default → primary/80; outline and ghost → muted; secondary → ~5% darker; destructive → stronger red tint; link → underline.
  Result:
- [ ] Active (mouse down): button shifts down 1px.
  Expected: shifts while pressed; no shift on a button with `aria-haspopup` (e.g. the Dialog trigger).
  Result:
- [ ] Focus-visible (Tab to it): 3px ring plus ring-colored border.
  Expected: ring visible on keyboard focus; not shown after a mouse click.
  Result:
- [ ] Disabled: 50% opacity, no hover, no pointer events.
  Expected: clicking does nothing; skipped by Tab.
  Result:
- [ ] Sizes: xs 24px, sm 28px (inferred), default 32px, lg 36px; icon sizes 24/28/32/36 square.
  Expected: heights as listed.
  Result:
- [ ] Icon + text: an icon child with `data-icon="inline-start"` reduces padding on that side.
  Expected: padding shrinks on the icon side.
  Result:
- [ ] `<a uiButton>`: looks like a button; focus ring works.
  Expected: Enter activates; Space does not.
  Result:

## Keyboard
- [ ] Tab / Shift+Tab. Expected: focus moves through buttons in DOM order; disabled ones skipped. Result:
- [ ] Enter on a focused `<button>`. Expected: click fires once. Result:
- [ ] Space on a focused `<button>`. Expected: click fires on key release. Result:

## Screen reader
- [ ] Text button. Expected: "<label>, button". Result:
- [ ] Icon-only button with aria-label. Expected: announces the label and "button". Result:
- [ ] Disabled button. Expected: announced as unavailable/dimmed. Result:

## Dark mode
- [ ] Toggle Dark. Expected: all variants use dark tokens; outline gets the `input/30` background; ring remains visible. Result:

## RTL
- [ ] Toggle RTL. Expected: icon + text order mirrors; an `inline-start` icon sits on the right with its reduced padding on the right. Result:
