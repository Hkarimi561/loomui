# Icons — manual test checklist
Showcase: **Icons** (header link, `/icons`).

## Browse & search
- [ ] Open the page.
  Expected: "1877 Lucide icons", a grid of icons with names, no layout jump while loading.
  Result:
- [ ] Type "home" (or press `/` first to focus the search).
  Expected: the grid filters to icons matching the name or tags (e.g. house, birdhouse…); count updates.
  Result:
- [ ] Search for gibberish.
  Expected: "No icon matches …" empty state.
  Result:
- [ ] Scroll to the bottom of the unfiltered grid / click "Show more".
  Expected: more icons load in batches of 180.
  Result:

## Customise
- [ ] Move the Size and Stroke sliders, pick a color swatch.
  Expected: all grid icons update live (no re-render flicker); the detail preview and generated SVG follow.
  Result:

## Copy
- [ ] Choose "Name", click an icon. Then "Element", "Import", "SVG".
  Expected: the clipboard gets `house` / `<ui-icon [icon]="House" … />` / `import { House } from 'lucide';` / a full `<svg …>`; a "copied" badge flashes; the choice is remembered after reload.
  Result:
- [ ] Open the detail panel tabs (Element, Component, Register, SVG, Install) and use Copy / Download .svg / Copy SVG.
  Expected: code reflects the current size/stroke/color; Download saves `<name>.svg`.
  Result:

## Keyboard
- [ ] Tab into the grid, use Arrow keys, Home, End; press Enter on an icon; press Esc.
  Expected: focus moves between icons (mirrored in RTL); Enter copies and opens details; Esc closes the details panel.
  Result:

## Screen reader / RTL / dark
- [ ] Icons are exposed as options named by the icon name; decorative icons elsewhere are `aria-hidden`; `<ui-icon label="…">` is announced as an image.
  Result:
- [ ] Toggle Dark and RTL.
  Expected: grid and panel remain readable; arrow-key directions mirror.
  Result:
