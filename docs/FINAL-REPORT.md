# Final report — Loom UI (Angular 22)

Workspace: Angular 22.2.2, Tailwind v4, CDK 22. Library: `libs/ui/<component>/`. Playground: `projects/playground` (landing page, menu, one demo page per component).
Run: `npm start` equivalent is `npx ng serve playground`.

## Completed: all 64 sidebar components (+ Button page), each with spec + implementation + README + manual checklist
**Original 17 (hand-written specs, deepest evidence):** Button, Badge, Input, Label, Card, Separator, Checkbox, Switch, Tabs, Dialog, Popover, Tooltip, Dropdown Menu, Select, Command, Sheet, Toast (Sonner).
**Second pass, class strings generated from REA slot evidence (`tools/gen-ui.mjs`) + hand-written behavior:** Alert, Alert Dialog, Aspect Ratio, Avatar, Breadcrumb, Button Group, Collapsible, Accordion, Context Menu, Menubar, Combobox, Drawer, Empty, Field, Hover Card, Input Group, Input OTP, Item, Kbd, Native Select, Navigation Menu, Pagination, Progress, Radio Group, Resizable, Scroll Area, Skeleton, Slider, Spinner, Table, Textarea, Toggle, Toggle Group.
**Third pass:** Calendar, Date Picker, Carousel (Embla), Chart (Chart.js), Sidebar, **Data Table (TanStack Table v9, `@tanstack/angular-table`)**, Direction, Typography, and the chat set Attachment, Bubble, Marker, Message, Message Scroller, Questionnaire.
Per component: `docs/behavior-specs/<c>.md`, `libs/ui/<c>/` (+ `README.md`), `docs/manual-tests/<c>.md`. Docs for the second/third pass are produced by `tools/gen-docs.mjs` from `tools/docs-data/*.mjs`: structure tables come from the REA evidence JSON, the parts/API tables and "special keys" lines are grepped from the code, and behavior notes are labelled as mixing REA evidence with shadcn/Radix source knowledge.

## What was verified, and how
- **Evidence source:** REA `capture_browser_scenario` (DOM/accessibility of the live docs pages) for structure, classes, `data-*`, ARIA; built-in browser real key presses and `activeElement` reads for keyboard/focus where REA's scenario tool cannot read focus.
- **Our build:** every component compiles (`ng build playground` passes). Verified in a real browser with real keys: Tabs (arrows/Home/End/skip-disabled/roving tabindex), Checkbox (click, label click, Enter ignored, indeterminate, reactive forms), Switch (click, forms), Dialog (portal, ARIA wiring, first-tabbable focus, Esc, focus return, scroll lock, aria-hidden), Dropdown Menu (open keys, arrows skip disabled, Home/End, Tab blocked, select/close, Esc + focus return), Select (open, arrows, select, re-open on selected, Esc, forms, label before first open), Command (filter, empty state, groups/separators hide, arrows skip disabled, Enter), Popover (4 sides, data-side, focus in), Sheet (right side geometry), Tooltip (hover, delayed-open, describedby), Toast (stacking, ARIA region).
- **Also verified (third pass, real browser):** Data Table (next page, text filter, sort desc, hide column, select-all), Carousel (next button, disabled-at-start, ArrowRight), Date Picker (open, pick, close, focus return, signal + reactive form), Sidebar (trigger and Ctrl+B collapse, mobile Sheet at 375px), Calendar (renders; weekday header bug found and fixed), Questionnaire (required error, next, multi-select, text, submit payload), Message Scroller (stick-to-end, release on scroll up, button, follow on add), Direction (Tabs ArrowLeft in an RTL subtree), Chart (renders bar/line/doughnut), earlier in the pass: Accordion, Radio Group, Slider, Input OTP, Resizable, Alert Dialog, Menubar, Combobox, Context Menu.
- **Not verified by me:** dark mode and RTL rendering for any component; screen-reader output; hover/active visuals (only class-level); Hover Card timers, Navigation Menu, Drawer drag, Scroll Area, Toggle Group, Collapsible, Chart tooltips/dark mode, Sidebar keyboard-only use; Dialog/Popover/etc. outside-click focus destination; signal forms (`[field]`) bindings; Tooltip focus-open and Esc; Command/Select typeahead; Toast timers, hover-expand, Alt+T. The manual checklists cover all of these for you to test.
- **Automated tests:** none written, as requested.

## Important findings about the source site
1. `https://ui.shadcn.com/docs/components/<name>` now **redirects to a Base UI variant**; the Radix variant is at `/docs/components/radix/<name>`. We followed Radix. Some pages mix both (e.g. a Base UI select/popover trigger appears next to Radix ones).
2. The live Button/Input/etc. use the newer **`base-nova` style** (`h-8`, `rounded-lg`, `ring-3`, `data-open:`/`data-closed:`/`data-checked:` variants) — that is what we reproduced.
3. The built-in browser pane is throttled when hidden: Radix applies focus on animation frames, so some live reads lagged by one step. Where a result was inconclusive it is marked UNKNOWN, not guessed.

## Known deviations from shadcn
- **RTL / logical properties:** `pl-/pr-` → `ps-/pe-` (Button, Badge, Tabs, Select, Dropdown items); Dialog/Sheet close button `right-2` → `end-2`; Switch thumb mirrored with `rtl:` variants; Tabs inherit direction instead of forcing `dir="ltr"`. Sheet left/right sides stay physical.
- **Architecture:** directives instead of components; no `asChild` (use the native element with the directive); the directive owns the whole `class` attribute; overlay content is declared inline and moved into a CDK overlay (always present in the DOM, hidden when closed, instead of being unmounted).
- **Select:** opens below the trigger (no Radix item-aligned positioning), no scroll buttons, no hidden native select.
- **Dropdown Menu:** sub-menus now exist (menu kit shared with Context Menu/Menubar); no `loop`; item class strings for the new style were partly reconstructed (only checkbox items and an older-style menu were captured).
- **Command:** plain substring filter, no cmdk score ordering; wrapper/icon styling invented; no `CommandDialog`.
- **Toast:** Sonner's injected CSS was not captured, `toast.css` is our reconstruction; no swipe, close button, promise toasts, rich colors; default position bottom-right.
- **Tooltip:** arrow is a rotated square (original: Radix SVG, classes not captured) and is barely visible; default delay 0.
- **Card:** site-specific `cn-font-heading` omitted.
- **Chart:** Chart.js (canvas) instead of Recharts (SVG); same `ChartConfig`/`--color-<key>` contract but different DOM, tooltip and accessibility (only `role="img"` + label).
- **Data Table:** a recipe in the original; here helpers (`ui-data-table-column-header|view-options|pagination`) + a demo around TanStack Table **v9** (the original uses v8 React).
- **Sidebar:** only the docs site's own customised sidebar could be observed live; structure follows shadcn's published source. Side is physical (not mirrored in RTL), no cookie persistence, collapsed tooltips use `title`.
- **Typography:** live page redirects to "Typeset" (CSS system + builder) — not reproduced; classic recipe provided as a directive.
- **Navigation Menu:** only the `viewport=false` layout (no shared animated viewport/indicator). **Combobox:** single-select only (no chips). **Drawer:** simplified drag, no snap points. **Context Menu / Menubar:** share the dropdown menu kit. **Scroll Area:** simplified visibility policy.
- **Chat set** (Message Scroller, Questionnaire, Attachment): behavior reconstructed from observed attributes; original source not available.
- **Packaging:** library is consumed through a tsconfig path alias; ng-packagr build/publish not set up. Overlay components need `overlay-prebuilt.css` and custom Tailwind variants in the consumer (documented in `libs/ui/README.md`).
- **Dev server:** when new CDK entry points appear on a lazy route, Vite may load two copies of `@angular/core` until the dependency cache is rebuilt (restart `ng serve` with `.angular/cache` removed, then reload twice).

## UNKNOWNs (aggregated; details in each spec)
- Source cross-check against `github.com/shadcn-ui/ui` and Radix was **not performed for any component**.
- Button: `sm` height (inferred `h-7`); computed hover/active colors.
- Badge: a `link` variant. Label: Radix double-click handling. Card: image-first variants.
- Checkbox: indeterminate on the original, hidden form input. Switch: Enter behavior, RTL thumb on the original.
- Tabs: arrow/Home/End behavior on the original (harness), `tabindex=0` on the tablist, manual activation.
- Dialog: Space on trigger, Enter submit in inputs, initial focus with no tabbable child, exact scroll-lock mechanism, `data-open:`↔`data-state` mapping, nested dialogs.
- Popover/Tooltip/Dropdown/Select/Command/Sheet: keyboard and focus behavior on the originals (several inconclusive), Tooltip delay and arrow, Select item-aligned geometry, cmdk wrap/ordering, Sheet RTL side mirroring.
- Toast: default position/offset, real CSS, timers, swipe thresholds, Alt+T behavior.
- Third pass: react-day-picker parity for Calendar (disabled ranges, locales), Embla `loop`/`dragFree`, Recharts-only features, Sidebar stock DOM, Questionnaire/Message Scroller original semantics, Hover Card delays, Navigation Menu viewport, Drawer snap/drag, Scroll Area auto-hide, TanStack v8 edge cases (multi-sort cycles).
- Everything dark-mode, RTL and screen-reader related.

## Showcase & distribution (latest pass)
- Showcase: redesigned landing, grouped searchable sidebar, **⌘K / Ctrl+K palette** (our Dialog + Command), **Preview | Code tabs** with copy buttons and a generated **API table** per component (`tools/gen-showcase-docs.mjs` from the READMEs), **accent color picker** (zinc/blue/violet/rose/orange/green), animated light/dark (circular reveal) and LTR/RTL (slide) switches via the View Transitions API with a CSS fallback; theme, accent and direction persist in localStorage and are applied before first paint.
- Dark / RTL / 375px sweep over all 64 pages: found and fixed a Chart `inject()` outside an injection context and overflow in Chart / Data Table pagination on phones.
- **Packaging:** `ng build ui` now succeeds (secondary entry points, `@loomui/ui`, theme CSS asset). Required changes: root `index.ts`, `@loomui/ui/utils` exports everything (no deep imports), menu item host bindings inlined (cross-entry-point spreads cannot be compiled), looser public option types on Chart/Carousel. Not published.
- **CLI:** `packages/loomui-cli` (`loomui init|add|list`) with a registry built by `tools/build-registry.mjs`; `add --all` output compiles under `ngc`. Not published to npm; registry served from the package folder or any URL (`--registry`).

- **Showcase UI pass (12 items):** interactive hero with draggable real components, bento grid (calendar, charts, live accent/dark, palette tile), component marquee, scroll reveals + cursor spotlight, resizable Fit/Tablet/Mobile preview (iframe at /embed/<slug> so breakpoints respond), per-component Playground knobs with generated code (button, badge, alert, progress, switch, toggle, input), "On this page" with anchor links (synthetic Example n headings where demos have none), code card with filename tabs/line numbers/confetti copy, deeper blue-black dark mode, tilt cards, sidebar icons + NEW badges + explored progress ring, shrinking header with scroll progress bar. Verified in browser at 1440px and 375px; 64-page console/overflow sweep clean.

## Icons, custom elements and showcase extras (latest pass)
- **Lucide icons:** `@loomui/ui/icon` (`<ui-icon>` + `svg[uiIcon]`, `registerIcons`, 1,877 icons available through `lucide`). The library's own inline SVGs (chevrons, check, x, …) now use it; a showcase **/icons** page searches by name/tag, customises size/stroke/color and copies Name / Element / Import / SVG.
- **Custom elements for all components:** 286 `ui-*` aliases (`tools/add-elements.mjs`) on the existing directives plus wrappers for native controls (`ui-input`, `ui-textarea`, `ui-native-select`, …). `UiElementHost` restores roles, tab stops, Enter/Space, `href`/`for` behavior, display defaults and `disabled`. Verified in a real browser on the **/elements** page: Enter/Space on `ui-button`, disabled, `ngModel` on input/select, label click, tabs (arrows, roving tabindex), dialog (trap, Esc, focus return), dropdown menu and select with real keys. Spec/manual tests: `docs/behavior-specs/custom-elements.md`, `docs/manual-tests/custom-elements.md`.
- **Known element limits:** `<ui-button>` cannot submit a form; native `<option>` stays native inside `<ui-native-select>`; screen-reader behavior of custom elements is unverified.
- **Visual ideas built:** animated gradient mesh hero, typing-code demo with a live result, light|dark compare slider (real components, `.force-light` scope), 3D layered stack, drag-and-drop form builder with generated code, component of the day, palette with live previews, skeleton while a demo loads, Themes page, optional UI sounds/haptics (off by default). The `dark:` variant now ignores `.force-light` subtrees. Manual checklist: `docs/manual-tests/showcase.md`.
- **Performance:** the landing page lag was a scroll handler writing a CSS variable on `<html>` and an animated header height; fixed (scroll ~53 → ~22 ms/frame in this environment), plus transform-only cursor spotlight and rAF-throttled tilt.
- **Not verified:** the skeleton-while-loading overlay (needs a slow network), sounds/vibration audibly, Firefox/Safari, screen readers.

## Naming
- Project name: **Loom UI**. npm: library `@loomui/ui` (scope `@loomui` must be created on npm), CLI `loomui` (`npx loomui add button`), theme file `loomui.css`, config `loomui.json`. Checked free on npm on 2026-10-11: `loomui`, `loomui-cli`, `@loomui/ui`. Domain and GitHub org were not checked.
- Branding: no "shadcn" in names, package metadata, keywords or marketing copy. Attribution lives in README, NOTICE.md and the showcase footer ("independent project inspired by shadcn/ui, not affiliated"); source comments keep factual provenance notes about where class strings came from.
- Kept: the `ui-` custom-element prefix and `Ui*` class names (generic, but short). A branded prefix would be a one-line change in `tools/add-elements.mjs`.
- Browser storage keys changed from `rea-*` to `loom-*` (saved theme/accent/direction reset once).

## Suggested next steps
1. Walk through the manual checklists, starting with Dialog, Dropdown Menu, Select, Tabs.
2. Decide whether to build the missing parts (dropdown sub-menus, item-aligned Select, cmdk scoring, swipe toasts).
3. Publish `@loomui/ui` and `Loom UI` (and host the registry JSON), then try them in a fresh `ng new` app.
4. Cross-check each spec against the shadcn and Radix sources (not done).
