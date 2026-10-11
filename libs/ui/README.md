# @loomui/ui — Loom UI

Directive-first Angular 22 components (also available as custom elements) with Radix-style behavior, built on the CDK and Tailwind v4. Inspired by shadcn/ui. Each component folder has its own README; behavior specs are in `docs/behavior-specs/`, manual checklists in `docs/manual-tests/`.

Import per component: `import { UiButton } from '@loomui/ui/button'` (path alias in `tsconfig.json`; secondary entry points are prepared with an `ng-package.json` per folder, but the library has not been built/published with ng-packagr yet).

## Install

**Option A — copy-in CLI (you own the code):**
```bash
npx loomui init
npx loomui add button dialog data-table
```
See `packages/loomui-cli/README.md`. All 64 components were verified to compile standalone (`ngc`, strict templates) after being copied this way.

**Option B — npm package:** `ng build ui` produces `dist/ui` (`@loomui/ui`, one secondary entry point per component, partial-Ivy). In the consumer:
```css
@import 'tailwindcss';
@import '@loomui/ui/styles/loomui.css';   /* tokens, variants, toast css, accent presets, @source for the package */
```
Optional peers: `embla-carousel` (Carousel), `chart.js` (Chart), `@tanstack/angular-table` (Data Table recipe). Not published to a registry yet.

## Required setup (only when wiring Tailwind manually — Options A/B already include it) (see `projects/playground/src/styles.css`)
1. Tailwind v4 (`@import 'tailwindcss'`), `tw-animate-css`, and the design tokens (`--background`, `--primary`, `--radius`, …, `.dark` class).
2. `@source` pointing at `libs/ui` so Tailwind scans the class strings.
3. Custom variants that map the `data-open:`/`data-checked:`-style classes onto Radix-style `data-state` attributes:
   `data-open`, `data-closed`, `data-checked`, `data-unchecked`, `data-active`, `data-inactive`, `data-horizontal`, `data-vertical`.
4. `@import '@angular/cdk/overlay-prebuilt.css'` and the backdrop override `.cdk-overlay-backdrop[data-slot]{opacity:1;transition:none}` (Dialog, Sheet, Popover, Tooltip, Dropdown Menu, Select).
5. `libs/ui/toast/toast.css` for `<ui-toaster>`; `.no-scrollbar` utility for Command; `@keyframes caret-blink` + `--animate-caret-blink` for Input OTP.
6. Chart/Sidebar tokens: `--chart-1..5` and `--sidebar*` (light + dark) with matching `--color-*` entries in `@theme inline`.
7. Extra dependencies per component: `embla-carousel` (Carousel), `chart.js` (Chart), `@tanstack/angular-table` (Data Table recipe), `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `@angular/cdk`.

## Custom elements
Every directive also exists as a custom element: `<button uiButton>` → `<ui-button>`, `<div uiDialogContent>` → `<ui-dialog-content>`, `<table uiTable>` → `<ui-table>` (a hyphen is required for custom elements, so it is `ui-` and not `<Button>`). Directives are unchanged and can be mixed freely. Native controls get wrapper elements (`<ui-input>`, `<ui-textarea>`, `<ui-native-select>`, …) that work with `ngModel`/reactive forms. A shared host directive restores roles, tab stops, Enter/Space activation and `disabled` on the elements. Spec: `docs/behavior-specs/custom-elements.md`. Limits: `<ui-button>` does not submit a `<form>` (use `(click)`).

## Icons
Lucide icons: `<ui-icon [icon]="Search" />` or `<svg uiIcon [icon]="Search">` (`npx loomui add icon`, peer dependency `lucide`). See `libs/ui/icon/README.md`; browse and copy at the showcase's **/icons** page.

## Conventions
- Every directive accepts `class`, merged with `tailwind-merge` (`cn()`); the directive owns the whole `class` attribute, so avoid `[class.x]` bindings on the same element.
- Overlay roots (`uiDialog`, `uiPopover`, …) are state holders: put `class="contents"` on them. Their content element is declared inline and moved into a CDK overlay while open (it stays in the DOM, hidden, otherwise).
- `data-slot` / `data-state` / `data-side` / `data-variant` attributes match the observed live site. When two directives share an element (e.g. `uiButton` + `uiDialogTrigger`) the Button's `data-slot="button"` wins, as on the live site.
- Form controls: Input/Label are native elements; Checkbox, Switch and Select implement `ControlValueAccessor` and expose `checked`/`value` models plus `disabled`/`invalid` inputs shaped for Angular signal forms (not yet exercised with `[field]`).

## Status
All 64 components of the docs sidebar are implemented; see each folder's README and `docs/behavior-specs/`.
See `docs/FINAL-REPORT.md`.
